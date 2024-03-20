<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Project;
use Doctrine\ORM\Tools\Pagination\Paginator;


#[Route('/api', name: 'api_')]
class ProjectController extends AbstractController
{
    #[Route('/project/updated-records', name: 'project_updated_records', methods: ['GET'])]
    public function updated_records(EntityManagerInterface $em, Request $request): Response
    {
        $lastUpdated = new \DateTime();
        $lastUpdated->modify("-24 hours");

        $projects = $em
            ->getRepository(Project::class)
            ->createQueryBuilder('p')
            ->where('p.updatedAt > :lastUpdated')
            ->setParameter('lastUpdated', $lastUpdated)
            ->getQuery()
            ->getResult();

        $data = [];

        foreach ($projects as $project) {
            $data[] = [
                'id' => $project->getId(),
                'name' => $project->getName(),
                'description' => $project->getDescription(),
                'created_at' => $project->getCreatedAt(),
                'updated_at' => $project->getUpdatedAt(),
                'deleted_at' => $project->getDeletedAt(),
            ];
        }

        return $this->json($data);
    }

    #[Route('/project', name: 'app_project', methods: ['GET'])]
    public function index(EntityManagerInterface $em, Request $request): Response
    {
        $showDeleted = $request->query->getBoolean('showDeleted');
        $page = $request->query->getInt('page');

        $queryBuilder = $em->getRepository(Project::class)->createQueryBuilder('p');

        if ($showDeleted) {
            $queryBuilder->where('p.deletedAt IS NOT NULL');
        } else {
            $queryBuilder->where('p.deletedAt IS NULL');
        }

        // Stránkování
    $paginator = new Paginator($queryBuilder);

    // Počet záznamů na stránku
    $itemsPerPage = 10;

    // Celkový počet položek
    $totalItems = count($paginator);

    // Výpočet počtu stránek
    $totalPages = ceil($totalItems / $itemsPerPage);

    // Nastavení prvního záznamu a maximálního počtu záznamů na stránku
    $paginator->getQuery()->setFirstResult(($page - 1) * $itemsPerPage)->setMaxResults($itemsPerPage);

    $projects = $paginator->getQuery()->getResult();

        $data = [];

        foreach ($projects as $project) {
            $data[] = [
                'id' => $project->getId(),
                'name' => $project->getName(),
                'description' => $project->getDescription(),
                'created_at' => $project->getCreatedAt(),
                'updated_at' => $project->getUpdatedAt(),
                'deleted_at' => $project->getDeletedAt(),
            ];
        }

        return $this->json([
            'data' => $data,
            'totalPage' => $totalPages,
        ]);
    }

    #[Route('/project/find', name: 'project_find', methods: ['GET'])]
    public function find(EntityManagerInterface $em, Request $request): Response
    {
        $find = $request->query->get('searchQuery');

        if ($find) {
            $projects = $em->getRepository(Project::class)->findByQuery($find);
        }

        $data = [];
        foreach ($projects as $project) {
            $data[] = [
                'id' => $project->getId(),
                'name' => $project->getName(),
                'description' => $project->getDescription(),
                'created_at' => $project->getCreatedAt(),
                'updated_at' => $project->getUpdatedAt(),
                'deleted_at' => $project->getDeletedAt(),
            ];
        }

        return $this->json($data);
    }

    #[Route('/project', name: 'project_new', methods: ['POST'])]
    public function new(EntityManagerInterface $em, Request $request): Response
    {
        $name = $request->request->get('name');
        $description = $request->request->get('description');

        if (!$name || !$description) {
            return $this->json('Name and description are required', 400);
        }

        $project = new Project();
        $project->setName($name);
        $project->setDescription($description);

        $em->persist($project);
        $em->Flush();

        return $this->json('Created new project succesfully with id' . $project->getId());
    }

    #[Route('/project/{id}', name:'project_show', methods: ['GET'])]
    public function show(EntityManagerInterface $em, int $id): Response
    {
        $project = $em->getRepository(Project::class)->findOneBy(['id' => $id, 'deletedAt' => null]);

        if (!$project) {
            return $this->json('No project found for id ' . $id, 404);
        }

        $data = [
            'id' => $project->getId(),
            'name' => $project->getName(),
            'description' => $project->getDescription(),
        ];

        return $this->json($data);
    }

    #[Route('/project/{id}', name: 'project_edit', methods: ['PUT', 'PATCH'])]
    public function edit(EntityManagerInterface $em, Request $request, int $id): Response
    {
        $content = json_decode($request->getContent());

        $name = $content->name;
        $description = $content->description;

        if (!$name || !$description) {
            return $this->json('Name and description are required', 400);
        }

        $project = $em->getRepository(Project::class)->findOneBy(['id' => $id, 'deletedAt' => null]);

        if (!$project) {
            return $this->json('No project found for id ' . $id, 404);
        }
        $project->setName($content->name);
        $project->setDescription($content->description);
        $project->setIsVisible($content->isVisible);
        $em->flush();

        $data = [
            'id' => $project->getId(),
            'name' => $project->getName(),
            'description' => $project->getDescription(),
            'isVisible' => $project->getIsVisible(),
        ];

        return $this->json($data);
    }

    #[Route('/project/{id}', name: 'project_delete', methods: ['DELETE'])]
    public function delete(EntityManagerInterface $em, int $id): Response
    {
        $project = $em->getRepository(Project::class)->find($id);

        if (!$project) {
            return $this->json('No project found for id ', $id, 404);
        }

        $em->remove($project);
        $em->flush();

        return $this->json('Deleted a project successfully with id ' . $id);
    }

    #[Route('/project/recover/{id}', name: 'project_recovery', methods: ['PATCH'])]
    public function recovery(EntityManagerInterface $em, Request $request, int $id): Response
    {
        $project = $em->getRepository(Project::class)
            ->createQueryBuilder('p')
            ->where('p.id = :id')
            ->andWhere('p.deletedAt IS NOT NULL')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();

        if(!$project)
            return $this->json('No project found for id ' . $id, 404);

        $project->setDeletedAt(null);
        $em->flush();

        return $this->json('Project with id ' . $project->getId() .' has been successfully archived');
    }
}
