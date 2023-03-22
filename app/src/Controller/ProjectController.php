<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Project;

#[Route('/api', name: 'api_')]
class ProjectController extends AbstractController
{
    #[Route('/project', name: 'app_project', methods: ['GET'])]
    public function index(EntityManagerInterface $em): Response
    {
        $projects = $em
            ->getRepository(Project::class)
            ->findAll();

        $data = [];

        foreach ($projects as $project) {
            $data[] = [
                'id' => $project->getId(),
                'name' => $project->getName(),
                'description' => $project->getDescription(),
                'created_at' => $project->getCreatedAt(),
                'updated_at' => $project->getUpdatedAt(),
            ];
        }

        return $this->json($data);
    }

    #[Route('/project', name: 'project_new', methods: ['POST'])]
    public function new(EntityManagerInterface $em, Request $request): Response
    {
        $project = new Project();
        $project->setName($request->request->get('name'));
        $project->setDescription($request->request->get('description'));

        $em->persist($project);
        $em->Flush();

        return $this->json('Created new project succesfully with id' . $project->getId());
    }

    #[Route('/project/{id}', name:'project_show', methods: ['GET'])]
    public function show(EntityManagerInterface $em, int $id): Response
    {
        $project = $em->getRepository(Project::class)->find($id);

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
        $project = $em->getRepository(Project::class)->find($id);

        if (!$project) {
            return $this->json('No project found for id ' . $id, 404);
        }

        $content = json_decode($request->getContent());
        $project->setName($content->name);
        $project->setDescription($content->description);
        $em->flush();

        $data = [
            'id' => $project->getId(),
            'name' => $project->getName(),
            'description' => $project->getDescription(),
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
}
