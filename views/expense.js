
    const pagination = document.getElementById('pagination');
    const downloadreportbtn = document.getElementById('downloadreport');
    //function perform on selecting the value of expense per page value
    document.getElementById('ePP').addEventListener('click', () => {
        const expensePerPage = document.getElementById('ePP').value;
         localStorage.setItem('expenseperpage', expensePerPage);
    })
    
    //function performed on clicking download button
    downloadreportbtn.addEventListener('click', async (e) => {
        try {
            e.preventDefault();
            console.log('clicked');
            //getting token from local storage
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:3000/download`, { headers: { "Authorization": token } });
            console.log('response when clicked download file', res);
            //when response status is 200 then create element a and download file
            if (res.status === 200) {
                const resp = await axios.post(`http://localhost:3000/postLink`, { link: res.data.fileUrl }, { headers: { "Authorization": token } });
                console.log(resp);
                 var a = document.createElement('a');
                a.href = res.data.fileUrl;
                a.download = 'myexpense.csv';
                a.click();
                // window.location.reload();
            }
            else {
                throw new Error(res.data.message);
            }
        }
        catch (err) {
            console.log(err);
        }
    })

    //function performed when clicked on add submit button
    function expensedata(e) {
        e.preventDefault();
        const amount = document.getElementById('amount').value;
        const description = document.getElementById('desc').value;
        const category = document.getElementById('sel').value;
        const obj = { amount: amount, description: description, category: category };
        const promise = addtodb(obj);
    }

    //addtodb function
    async function addtodb(obj) {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`http://localhost:3000/addData`, obj, { headers: { "Authorization": token } });
            showonscreen(res.data.datas);
        }
        catch (err) {
            console.log('error in adding to db');
            console.log(err);
        }
    }

    function showonscreen(obj) {
        const tbody = document.getElementById('tbodydtde');
        const row = document.createElement("tr");
        const cell1 = document.createElement("td");
        const cellText1 = document.createTextNode(obj.description);
        cell1.appendChild(cellText1);
        const cell2 = document.createElement("td");
        const cellText2 = document.createTextNode(obj.category);
        cell2.appendChild(cellText2);
        const cell3 = document.createElement("td");
        const cellText3 = document.createTextNode(obj.amount);
        cell3.appendChild(cellText3);
        const del = document.createElement('button');
        del.style.backgroundColor = 'red';
        del.innerHTML = 'x';
        const cell4 = document.createElement("td");
        cell4.appendChild(del);
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);
        tbody.appendChild(row);
        del.addEventListener('click', async (e) => {
            tbody.removeChild(row);
            const token = localStorage.getItem('token');
            const data = await axios.post(`http://localhost:3000/delete`, obj, { headers: { "Authorization": token } });
            console.log(data);
        })
    }


    function fetchdata(obj) {
        document.getElementById('amount').value = obj.amount;
        document.getElementById('desc').value = obj.description;
        document.getElementById('sel').value = obj.category;
    }

    //on page reload, displaying element according to premium and non premium user
    window.addEventListener('DOMContentLoaded', async () => {
        try {
            const ePP = localStorage.getItem('expenseperpage');
            const token = localStorage.getItem('token');
            // console.log('token from html page is',token);
            const resp = await axios.get(`http://localhost:3000/checkpremiumuser`, { headers: { "Authorization": token } })
            const currentUser = document.getElementById('currentUser');
            currentUser.appendChild(document.createTextNode('Logged in as:'));
            currentUser.appendChild(document.createTextNode('\u00A0'));
            currentUser.appendChild(document.createTextNode(resp.data.name));
            //if user is PREMIUM user
            if (resp.data.flag === true) {
                const premdisplay = document.getElementById('prembtn');
                premdisplay.innerHTML = 'you are premium user';
                premdisplay.appendChild(document.createTextNode('\u00A0\u00A0'));
                const button = document.createElement('button');
                button.id = 'leaderboardbtn'
                button.type = 'submit';
                button.innerHTML = 'show Leaderboard';
                premdisplay.appendChild(button);
                //function performed on clicking show leaderboard button
                button.addEventListener('click', async (e) => {
                    // document.getElementById('leaderboard').innerHTML = '';
                    document.getElementById('leaderboard').innerHTML = `<h1>leaderboard</h1>
            <table border="2" width="100%" id="leaderboardelement">
                <col style="width:60%">
                <col style="width:40%">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Total Expense</th>
                    </tr>
                </thead>
                <tbody id="tbodyleaderboard">

                </tbody>
            </table>`;
                    // document.getElementById('tbodyleaderboard').innerHTML = '';
                    const res = await axios.get(`http://localhost:3000/premium/leaderboard`);
                    // console.log(res.data);
                    for (let i = 0; i < res.data.datas.length; i++) {
                        showleaderboard(res.data.datas[i]);
                    }
                });

                //adding reports button to top
                document.getElementById('navbar').innerHTML = `<button type="submit" id="dailyReport">Daily Report</button>
                <button type="submit" id="weeklyReport">Weekly Report</button>
                <button type="submit" id="monthlyReport">Monthly Report</button>`;

                const dailyReportbtn = document.getElementById('dailyReport');
                dailyReportbtn.addEventListener('click', async (e) => {
                    window.location.href = `http://localhost:3000/getdailyreportpage`;
                });
                const weeklyreportbtn = document.getElementById('weeklyReport');
                weeklyreportbtn.addEventListener('click', (e) => {
                    window.location.href = `http://localhost:3000/getweeklyreportpage`;
                })
                const mothlyreportbtn = document.getElementById('monthlyReport');
                mothlyreportbtn.addEventListener('click', (e) => {
                    window.location.href = `http://localhost:3000/getmonthlyreportpage`;
                })
                document.getElementById('filesdownload').appendChild(document.createTextNode(`Download History: you can download again these files`));

                downloadolderversionfile();
            }
            //if user is NOT PREMIUM user
            else {
                downloadreportbtn.disabled = true;
                const premdisplay = document.getElementById('prembtn');
                premdisplay.innerHTML = 'you are not premium user';
                premdisplay.appendChild(document.createTextNode('\u00A0\u00A0'));
                const button = document.createElement('button');
                button.id = 'buypremium'
                button.type = 'submit';
                button.innerHTML = 'Buy Premium';
                premdisplay.appendChild(button);
                
                const buypremium = document.getElementById('buypremium');
                //function perfomed on clicking buy premium button
                buypremium.addEventListener('click', async (e) => {
                    console.log('clicked');
                    e.preventDefault();
                    const token = localStorage.getItem('token');
                    const res = await axios.get(`http://localhost:3000/purchase/premiummembership`, { headers: { "Authorization": token } });
                    console.log('response after getting /purchase/premiummemb.', res);
                    var option = {
                        "key": res.data.key_id,
                        "orderid": res.data.order.id,
                        "handler": async function (response) {
                            await axios.post(`http://localhost:3000/purchase/updatetransactionstatus`, {
                                order_id: option.orderid,
                                payment_id: response.razorpay_payment_id,
                            }, { headers: { "Authorization": token } });
                            location.reload();
                            alert('you are premium user now');
                        }
                    }
                    const rzp1 = new Razorpay(option);
                    rzp1.open();
                    e.preventDefault();
                    //if payment failed then update database and alert user
                    rzp1.on('payment.failed', function (response) {
                        console.log(response);
                        axios.post(`http://localhost:3000/purchase/updatetxnfailed`, {
                            order_id: option.orderid,
                            payment_id: 'Failed Payment',
                        }, { headers: { "Authorization": token } });
                        // })
                        alert('something went wrong');
                    })

                })

                document.getElementById('navbar').hidden = true;
                document.getElementById('leaderboard').hidden = true;
            }

            // if(document.getElementById('tbodydtde').children.length ==0){
            //     document.getElementById('tbodydtde').innerHTML = 'No Data to display';
            // }
            //displaying number as selected before
            document.getElementById('ePP').value =ePP;

            //getting data as per page and numner of record per page
            const page = 1;
            const res = await axios.post(`http://localhost:3000/getPageData?page=${page}`, { expensePerPage: ePP }, { headers: { "Authorization": token } });

            for (let i = 0; i < res.data.datas.length; i++) {
                showonscreen(res.data.datas[i]);
            }
            showpagination(page, res.data.hasNextPage, res.data.nextPage, res.data.hasPreviousPage, res.data.previousPage, res.data.lastPage);
        }
        catch (err) {
            console.log('error in getting all data');
            console.log(err);
        }
    });

    async function getExpenses(page) {
        try {
            const ePP = localStorage.getItem('expenseperpage');
            const token = localStorage.getItem('token');
            const res = await axios.post(`http://localhost:3000/getPageData?page=${page}`, { expensePerPage: ePP }, { headers: { "Authorization": token } });
            for (let i = 0; i < res.data.datas.length; i++) {
                showonscreen(res.data.datas[i]);
            }
            showpagination(page, res.data.hasNextPage, res.data.nextPage, res.data.hasPreviousPage, res.data.previousPage, res.data.lastPage);
        }
        catch (err) {
            console.log(err);
        }
    }

    function showpagination(currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage, lastPage) {
        const pagination = document.getElementById('pagination');
        const tbody = document.getElementById('tbodydtde');
        pagination.innerHTML = '';
        if (hasPreviousPage) {
            const btn2 = document.createElement('button');
            btn2.innerHTML = previousPage;
            btn2.addEventListener('click', () => {
                tbody.innerHTML = '';
                getExpenses(previousPage);
            });
            pagination.appendChild(btn2);
        }
        const btn1 = document.createElement('button');
        btn1.innerHTML = currentPage;
        btn1.addEventListener('click', () => {
            tbody.innerHTML = '';
            getExpenses(currentPage)
        });
        pagination.appendChild(btn1);

        if (hasNextPage) {
            const btn3 = document.createElement('button');
            btn3.innerHTML = nextPage;
            btn3.addEventListener('click', () => {
                tbody.innerHTML = '';
                getExpenses(nextPage)
            });
            pagination.appendChild(btn3);
        }
    }

    //displaying leaderboard data on screen
    function showleaderboard(obj) {
        if (obj.totalExpense === null) {
            obj.totalExpense = 0;
        }

        const tbody = document.getElementById('tbodyleaderboard');
        const row = document.createElement("tr");
        const cell1 = document.createElement("td");
        const cellText1 = document.createTextNode(obj.name);
        cell1.appendChild(cellText1);
        const cell2 = document.createElement("td");
        const cellText2 = document.createTextNode(obj.totalExpense);
        cell2.appendChild(cellText2);
        row.appendChild(cell1);
        row.appendChild(cell2);
        tbody.appendChild(row);
    }

    async function downloadolderversionfile() {
        try {
            const token = localStorage.getItem('token');
            const fileslinks = document.getElementById('downloadfilelinks');
            const res = await axios.get(`http://localhost:3000/getFileLinks`, { headers: { "Authorization": token } });
            console.log(res.data);
            if (res.data.alllinks.length > 0) {
                for (let i = 0; i < res.data.alllinks.length; i++) {
                    fileslinks.innerHTML += `<a  href=${res.data.alllinks[i].link}>version${i}</a><br>`;
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
