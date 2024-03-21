<?php

namespace App\DataFixtures;

use App\Entity\Project;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ProjectFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $generator = Factory::create();

        for ($i = 0; $i <= 100;$i++) {
            $project = new Project();
            $project->setName($generator->sentence());
            $project->setDescription($generator->text(300));
            $created_at = $generator->dateTimeBetween('-1 year', ' -4 day');
            $project->setCreatedAt($created_at);
            $updated_at = $generator->dateTimeBetween($created_at, '-2 day');
            $project->setUpdatedAt($updated_at);
            $deleted_at = $generator->optional(0.2, null)->dateTimeBetween($created_at, 'now'); // 20% šance na vytvoření soft delete projektu
            if ($deleted_at !== null) {
                $project->setDeletedAt($deleted_at);
            }
            $project->setIsVisible(1);

            $manager->persist($project);
        }

        $manager->flush();
    }
}
