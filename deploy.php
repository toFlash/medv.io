<?php
namespace Deployer;

require 'recipe/common.php';

host('one')
    ->set('deploy_path', '~/medv.io');

desc('Deploy your project');
task('deploy', [
    'build',
    'deploy:prepare',
    'deploy:release',
    'upload',
    'deploy:symlink',
    'cleanup',
    'success',
    'say',
]);

task('build', function () {
    run('gulp');
})->local();

task('upload', function () {
    upload(__DIR__ . '/dist/', '{{release_path}}');
});


task('say', function () {
    runLocally("say 'medv.io успешно задеплоен'");
});
