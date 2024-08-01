<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;

class TeamsTestSeeder extends Seeder
{
    private Team $team;

    private User $teamOwner;

    private User $teamAdmin;

    private User $teamEditor;

    public function run(): void
    {
        $this->createUsersThatHaveTeams();

        $this->createTeamsWithOwners();

        $this->setUsersDefaultTeams();

        $this->addTeamMembersWithRoles();
    }

    private function createUsersThatHaveTeams(): void
    {
        $this->teamOwner = User::factory([
            'name' => 'Team One Owner',
            'email' => 'teamowner@example.com',
        ])->create();

        $this->teamAdmin = User::factory([
            'name' => 'Team One Admin',
            'email' => 'teamadmin@example.com',
        ])->create();

        $this->teamEditor = User::factory([
            'name' => 'Team One Editor',
            'email' => 'teameditor@example.com',
        ])->create();
    }

    private function createTeamsWithOwners(): void
    {
        $this->team = Team::factory([
            'id' => 1,
            'name' => 'Test Team',
            'user_id' => $this->teamOwner->id,
            'personal_team' => false,
        ])->create();
    }

    private function setUsersDefaultTeams(): void
    {
        $this->teamOwner->current_team_id = $this->team->id;
        $this->teamOwner->save();

        $this->teamAdmin->current_team_id = $this->team->id;
        $this->teamAdmin->save();

        $this->teamEditor->current_team_id = $this->team->id;
        $this->teamEditor->save();
    }

    private function addTeamMembersWithRoles(): void
    {
        $this->team->users()->attach(
            $this->teamAdmin, ['role' => 'admin']
        );

        $this->team->users()->attach(
            $this->teamEditor, ['role' => 'editor']
        );
    }
}
