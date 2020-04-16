<?php

namespace App\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Question\Question;
use Symfony\Component\Console\Question\ChoiceQuestion;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Tools\Setup;
use Doctrine\ORM\Query\ResultSetMapping;
use Symfony\Component\Console\Helper\ProgressBar;

class ImportEntitiesCommand extends Command
{
    protected static $defaultName = 'app:import:entities';
    private $timerActivated = false;

    public function __construct(bool $requirePasword = false)
    {
        $this->requirePasword = $requirePasword;
        parent::__construct();
    }

    protected function configure()
    {
        $this
            ->setDescription('Imports all unknown entities from the database')
            ->setHelp('This command imports all new entities in the given database')
            ->addOption(
                'timer',
                null,
                InputOption::VALUE_NONE,
                'Shows elapsed time'
            );
    
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->input = $input;
        $this->output = $output;

        $helper = $this->getHelper('question');
        $rsm = new ResultSetMapping();
        
        $isUsingLiveDatabase = new Question('Are you using an production database in your .env file? (yes/no) ');
        
        $isUsingLiveDatabase = $helper->ask($input, $this->output, $isUsingLiveDatabase);
        if($isUsingLiveDatabase !== 'no') {
            exit("Make sure you are connected to the local database and try again");
        }

        $dbQuestion = new Question('Enter the name of the database: ');
        $dbHostQuestion = new Question('Enther the db host: ');
        $userQuestion = new Question('Enther the db user: ');
        $passQuestion = new Question('Enther the db password: ');
        $passQuestion->setHidden(true);
    
        $dbName = $helper->ask($input, $this->output, $dbQuestion);
        $dbHost = $helper->ask($input, $this->output, $dbHostQuestion);
        $dbUser = $helper->ask($input, $this->output, $userQuestion);
        $dbPass = $helper->ask($input, $this->output, $passQuestion);

        if($input->getOption('timer'))
        {
            $this->timerActivated = true;
        }
        
        if($dbHost === 'localhost'){
            $dbHost = '127.0.0.1'; //localhost is not supported, it has to be 127.0.0.1
        } 

        $this->connectionParams = [
            'dbname' => $dbName,
            'user' => $dbUser,
            'password' => $dbPass,
            'host' => $dbHost,
        ];

        $this->createEntitieAndMapping();
        $this->output->writeln('');       
    }

    private function retrieveTableNames()
    {
        $this->output->writeln('Retrieving table names...');
        
        $sql = "
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'autodata-dev-regression-mhc' 
            AND (
                (table_name LIKE 'system%')
                OR
                (table_name LIKE 'systeem%')
                OR
                (table_name LIKE 'ACTINIDIUM%')
                )";

        $stmt = $this->connection->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll();

        foreach($result as $t)
        {
            $table = $t['table_name'];
            array_push($this->tables, $table);
        }
        $this->showTime();
        return $this->tables;
    }

    private function retrieveCreateQueries(Array $tableNames)
    {
        $this->output->writeln('Retrieving create queries....');
        $createQueries = [];
       
        foreach($tableNames as $t)
        {
            $query = "SHOW CREATE TABLE " . $t;
            $stmt = $this->connection->prepare($query);
            $stmt->execute();
            $create = $stmt->fetchAll();
            if(array_key_exists('Table', $create[0])) {
                array_push($createQueries, $create);
            }
        }

        $this->showTime();
        return $createQueries;
    }

    private function createTables(Array $queries)
    {
        $this->output->writeln("Removing all tables...");
        shell_exec("bin/console doctrine:database:drop --force");
        shell_exec("bin/console doctrine:database:create");
        shell_exec('bin/console doctrine:query:sql "SET @@GLOBAL.FOREIGN_KEY_CHECKS=0"');
        shell_exec('bin/console doctrine:query:sql "SET @@SESSION.FOREIGN_KEY_CHECKS=0"');
        $this->showTime();
        $this->output->writeln("Creating tables: ");
        $progressBar = new ProgressBar($this->output, sizeof($queries));

        foreach($queries as $q)
        {          
            $createTable = $q[0]['Create Table'];
            $createTable = str_replace('`', '\`', $createTable);
            $createTable = 'bin/console doctrine:query:sql "' . $createTable . '"';
            
            shell_exec($createTable);
            $progressBar->advance();
        }
        $this->output->writeln('');
        shell_exec('bin/console doctrine:query:sql "SET @@GLOBAL.FOREIGN_KEY_CHECKS=1"');
    }

    private function addPrimaryKeys()
    {
        $res = shell_exec('bin/console doctrine:query:sql "SELECT table_name FROM information_schema.columns WHERE table_schema = \'' . getenv('DATABASE_NAME') . '\' GROUP BY table_schema,table_name HAVING sum(if (column_key in (\'PRI\', \'UNI\'), 1, 0)) = 0"');
        $res = explode('"', $res);
        
        $this->tables = [];
        $count = count($res);
        
        for($i = 3; $i < $count; $i += 4)
        {
            array_push($this->tables, $res[$i]);
        }
        
        foreach($this->tables as $t)
        {
            shell_exec('bin/console doctrine:query:sql "ALTER TABLE ' . $t . ' ADD pk_id INT PRIMARY KEY AUTO_INCREMENT FIRST;"');
        }

        $this->showTime();
    }

    private function createConnection()
    {
        $paths = ['src/Entity'];
        $config = Setup::createAnnotationMetadataConfiguration($paths);
        $em = EntityManager::create($this->connectionParams, $config);
        $conn = $em->getConnection();

        $this->connection = $conn;
    }

    private function createEntitieAndMapping()
    {
        $this->output->writeln('Creating entities....');
        $useStatement = 'use ApiPlatform\Core\Annotation\ApiResource;';
        $apiResourceTag = ' * @ApiResource';

        $repositoryTag = '@ORM\Entity(repositoryClass="App\Repository';

        shell_exec('bin/console doctrine:mapping:import App\\\Entity annotation --path=src/Entity');

        $this->showTime();
        $this->output->writeln('Adding @ApiResource tag....');
        $path = 'src/Entity';
        $entities = scandir($path);
        
        foreach($entities as $e)
        {
            if(substr($e, 0, 1) != '.')
            {
                $file = $path . '/'. $e;
                $fileContent = file_get_contents($file);
                if(strpos($fileContent, $useStatement) == false) {
                    $fileContent = str_replace('use Doctrine\ORM\Mapping as ORM;','use Doctrine\ORM\Mapping as ORM;' . "\r\n" . $useStatement, $fileContent);
                }

                if(strpos($fileContent, $apiResourceTag) == false) {
                    $fileContent = str_replace(" * @ORM\Entity", " * @ORM\Entity \r\n" . $apiResourceTag, $fileContent);
                }

                if(strpos($fileContent, $repositoryTag) == false) {
                    $fileContent = str_replace('@ORM\Entity', $repositoryTag . "\\" . substr($e, 0, strlen($e) -4) . 'Repository")', $fileContent);
                }
                
                file_put_contents($file, $fileContent);
            }
        }
        
        $this->showTime();
        $this->output->writeln('Adding Getters/Setters....');
        shell_exec('bin/console make:entity --regenerate App');
        $this->showTime();
        $this->output->writeln('Creating mappings....');
        shell_exec("bin/console doctrine:mapping:import App\\Entity --path=src/Mapping");
        $this->showTime();
    }

    private function showTime()
    {
        if($this->timerActivated)
        {
            $this->output->writeln(microtime(true) - $this->time_pre);
            $this->time_pre = microtime(true);
        }
    }
}