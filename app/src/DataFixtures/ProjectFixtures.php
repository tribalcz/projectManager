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
            $created_at = $generator->dateTimeBetween('-1 year', 'now');
            $project->setCreatedAt($created_at);
            $updated_at = $generator->dateTimeBetween($created_at, 'now');
            $project->setUpdatedAt($updated_at);
            $deleted_at = $generator->optional(0.2, null)->dateTimeBetween($created_at, 'now');
            if ($deleted_at !== null) {
                $project->setDeletedAt($deleted_at);
            }
            $project->setIsVisible(1);

            $manager->persist($project);
        }

        $manager->flush();
    }
}
