# May require Docker Desktop running on Windows.

date
set -x
git pull                                                ; if [ $? -ne 0 ] ; then exit -6 ; fi
# To completely toss all docker images, volumes and containers, networks, images and volumes:
docker-compose down --rmi all
docker compose up -d                                    ; if [ $? -ne 0 ] ; then exit -6 ; fi
docker compose exec app yarn install                    ; if [ $? -ne 0 ] ; then exit -6 ; fi
docker compose exec frontend yarn install               ; if [ $? -ne 0 ] ; then exit -6 ; fi
docker compose exec app yarn db:migrate                 ; if [ $? -ne 0 ] ; then exit -6 ; fi
docker compose exec app yarn db:seed                    ; if [ $? -ne 0 ] ; then exit -6 ; fi
# docker compose exec app yarn test                       ; if [ $? -ne 0 ] ; then exit -6 ; fi
