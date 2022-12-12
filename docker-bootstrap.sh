# Must run some manual steps first, see:
# https://github.com/usdigitalresponse/usdr-gost/wiki/Setting-up-development-environment-in-Docker-on-Windows

# chmod a+x /mnt/c/Users/chris/Documents/Github/gost-tmp/bootstrap-docker.sh
# dos2unix /mnt/c/Users/chris/Documents/Github/gost-tmp/bootstrap-docker.sh

set -x
docker --version                                                ; if [ $? -ne 0 ] ; then exit -6 ; fi
cd ~/github/                                                    ; if [ $? -ne 0 ] ; then exit -6 ; fi
# git clone https://github.com/usdigitalresponse/usdr-gost.git  ; if [ $? -ne 0 ] ; then exit -6 ; fi
cd ./usdr-gost/                                                 ; if [ $? -ne 0 ] ; then exit -6 ; fi
docker compose up -d                                            ; if [ $? -ne 0 ] ; then exit -6 ; fi
docker compose exec app yarn install                            ; if [ $? -ne 0 ] ; then exit -6 ; fi
docker compose exec frontend yarn install                       ; if [ $? -ne 0 ] ; then exit -6 ; fi
docker compose exec app yarn db:migrate                         ; if [ $? -ne 0 ] ; then exit -6 ; fi
docker compose exec app yarn db:seed                            ; if [ $? -ne 0 ] ; then exit -6 ; fi
docker compose exec app yarn test                               ; if [ $? -ne 0 ] ; then exit -6 ; fi
docker compose exec postgres bash                               ; if [ $? -ne 0 ] ; then exit -6 ; fi

# docker compose exec postgres bash -c "...load self user into db..."
