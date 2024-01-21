const jwt=require('jsonwebtoken');
const token = localStorage.getItem('token');

        console.log(token);
        const user = jwt.verify(token,'secretKey');
        if(user.isPremium){
            document.getElementById('reportdownload').disabled = false;
        }
