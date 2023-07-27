#! /bin/bash
source /etc/profile
cd /Users/ness/Documents/fit-main
# npm unpublish gfit --force
npm publish 
git add . 
git commit -m 'd'
git push
