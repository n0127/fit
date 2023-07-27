#! /bin/bash
source /etc/profile
cd /Users/ness/Documents/fit-main
# npm unpublish gfit --force
npm publish 


git checkout main
git branch | grep -v 'main' | xargs git branch -D
git branch -r | grep -v 'main' | sed 's/origin\///' | xargs -I {} git push origin --delete {}
git add . 
git commit -m 'd'
version=`grep -o '"version": "[^"]*' | grep -o '[^"]*$'`
echo $version
git push origin main
git checkout $version
git add . 
git commit -m 'd'
git push origin $version
