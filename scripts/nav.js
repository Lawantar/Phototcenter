function openMainPage(){
    var theForm;
    theForm = document.createElement('form');
    theForm.action = '/mainPage';
    theForm.method = 'post';
    document.getElementById('openLink').appendChild(theForm);
    theForm.submit();
    return;
}
function openOrdersPage(){
    var theForm;
    theForm = document.createElement('form');
    theForm.action = '/ordersPage';
    theForm.method = 'post';
    document.getElementById('openLink').appendChild(theForm);
    theForm.submit();
    return;
}
function openFormsPage(){
    var theForm;
    theForm = document.createElement('form');
    theForm.action = '/formsPage';
    theForm.method = 'post';
    document.getElementById('openLink').appendChild(theForm);
    theForm.submit();
    return;
}
function openTasksPage(){
    var theForm;
    theForm = document.createElement('form');
    theForm.action = '/tasksPage';
    theForm.method = 'post';
    document.getElementById('openLink').appendChild(theForm);
    theForm.submit();
    return;
}
function openTablesPage(){
    var theForm;
    theForm = document.createElement('form');
    theForm.action = '/tablesPage';
    theForm.method = 'post';
    document.getElementById('openLink').appendChild(theForm);
    theForm.submit();
    return;
}