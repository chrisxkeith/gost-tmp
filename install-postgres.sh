# From: https://www.cybertec-postgresql.com/en/postgresql-on-wsl2-for-windows-install-and-setup/

sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
                                  if [ $? -ne 0 ] ; then exit -6 ; fi 
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
                                  if [ $? -ne 0 ] ; then exit -6 ; fi 
sudo apt-get update
                                  if [ $? -ne 0 ] ; then exit -6 ; fi 
sudo apt-get -y install postgresql postgresql-contrib
                                  if [ $? -ne 0 ] ; then exit -6 ; fi 
psql --version
                                  if [ $? -ne 0 ] ; then exit -6 ; fi 
sudo service postgresql start
                                  if [ $? -ne 0 ] ; then exit -6 ; fi 
