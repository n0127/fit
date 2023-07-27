#! /bin/bash
source /etc/profile
cd /Users/ness/Documents/fit-main
# npm unpublish gfit --force
npm publish 


git checkout main
git branch | grep -v 'main' | xargs git branch -D
git add . 
git commit -m 'd'
version=`grep -o '"version": "[^"]*' | grep -o '[^"]*$'`
git push
git checkout $version
git add . 
git commit -m 'd'
git push origin $version
