var currentBucket = '';
var currentObject = '';
var buckets = [];
var objects = [];

function getBuckets(){
    var ul = document.getElementById('bucketsUl');
    ul.innerHTML = ''

    jQuery.ajax({
        url: '/api/forge/dataManagement/getBuckets',
        success: function(res){
            buckets = res.buckets;
            for (var i = 0; i < buckets.length; i++){

                var li = document.createElement('li');
                var bucketKey = buckets[i].bucketKey;
                var bucketKeyNode = document.createTextNode(bucketKey);
                li.appendChild(bucketKeyNode);

                if (bucketKey == '') {
                    alert('Name is emty!');
                } else {
                    document.getElementById('bucketsUl').appendChild(li);
                }
                
                li.onclick = function(){
                    currentBucket = this.childNodes[0].data;
                    document.getElementById('textBuckets').innerHTML = 'Current bucket is: ' + currentBucket;
                    getObjects();
                }
                
            }
        }
    });
    }

function getObjects(){
    if(currentBucket != ''){
    var ul = document.getElementById('objectsUl');
    ul.innerHTML = ''

    jQuery.ajax({
        url: '/api/forge/dataManagement/bucket/objects/' + currentBucket,
        success: function(res){
            
            objects = res.objects;
            
            for (var i = 0; i < objects.length; i++){

                var li = document.createElement('li');
                var objectKey = objects[i].objectKey;
                var objectKeyNode = document.createTextNode(objectKey);
                li.appendChild(objectKeyNode);
                

                if (objectKey === '') {
                    alert('Name is emty!');
                } else {
                    document.getElementById('objectsUl').appendChild(li);
                }
                
                li.onclick = function(){
                    for (var i = 0; i < objects.length; i++){
                        if (objects[i].objectKey == this.childNodes[0].data){
                            currentObject = objects[i];
                            document.getElementById('textObjects').innerHTML = 'Current object is: ' + currentObject.objectKey;
                        }
                    }
                }
                
            }
        }
    });
    }
}

function viewObject(){
    if(currentObject != ''){
        window.location.href = '/viewer.html?urn=' + currentObject.objectId;
    }else{
        alert('Please click on an object first!')
    }
}

function createBucket(){
    var bucketName = document.getElementById('bucketName').value;

    if(bucketName != ''){
        window.location.href = '/api/forge/dataManagement/bucket/create/' + bucketName;
    }else{
        alert('Please give a bucket name!');
    }
}

function uploadFile(){
    if (currentBucket != '' && document.getElementById('fileToUpload').value != ''){
        document.getElementById('uploadForm').action = '/api/forge/dataManagement/bucket/upload/' + currentBucket;
        document.getElementById("uploadForm").submit();
    } else {
        alert('Please choose a bucket and file first!')
    }
}

function deleteTranslation(){
    if(currentObject != ""){
        var r = confirm("Are you sure you want to delete the translation?");
        if (r == true){
            window.location.href = '/api/forge/modelDerivative/delete/translation/' + currentObject.objectId;
        }
    }else{
        alert("Please choose an object first!");
    }
}

function deleteObject(){
    if(currentObject != ""){
        var r = confirm("Are you sure you want to delete the object?");
        if (r == true){
            window.location.href = '/api/forge/dataManagement/delete/object/' + currentBucket + '/' + currentObject.objectKey;
        }
    }else{
        alert("Please choose an object first!");
    }
}

function deleteBucket(){
    if(currentBucket != ""){
        var r = confirm("Are you sure you want to delete the bucket?");
        if (r == true){
            window.location.href = '/api/forge/dataManagement/delete/bucket/' + currentBucket;
        }
    }else {
        alert("Please choose a bucket first!");
    }
}