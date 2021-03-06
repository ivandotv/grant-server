#!/bin/bash
set -euo pipefail

temp_build_dir='temp_build_dir'
username='ivandotv'
image_name='grant-server'
build_params="$@"
full_image_name=${username}/${image_name}
full_image_name_latest=${full_image_name}:latest

if [[ -n "${GITHUB_WORKFLOW:-}" ]];then
    # we are running in CI
    # get image tag from ref/tag
    full_image_name=$full_image_name:${SOURCE_TAG}
fi


function clean_up(){
    rm -rf ${temp_build_dir}
}

trap clean_up ERR SIGINT

mkdir -p ${temp_build_dir}

cp docker-image/Dockerfile ${temp_build_dir}

cp package*.json ${temp_build_dir}

cp -R dist ${temp_build_dir}

docker build ${build_params} -t ${full_image_name} -t ${full_image_name_latest} ${temp_build_dir}


if [[ -n "${GITHUB_WORKFLOW:-}" ]];then
    # push only if building from CI
    docker push ${username}/${image_name}
fi

clean_up
