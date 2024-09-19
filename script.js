// 변수, 상수 생성
// list에 todo 리스트 하나씩 저장하기 위함, html에서 지정한 id list 사용
const list = document.getElementById("list");
// 버튼 엘리먼트 저장을 위해 html에서 지정한 id create-btn 사용
const createBtn = document.getElementById("create-btn");

// todo list의 데이터를 배열에 넣기
// 투두 하나 == 객체 하나
// id는 유니크한 값(고유한 값), text는 todo 내용, complete는 완료 여부
//let todos = [{id: sdfsdg, text: '밥먹기', complete: false}];
let todos = [];

// click 이벤트가 발생했을 때 리스너 등록, 리스너 함수는 따로 빼서 작성
createBtn.addEventListener('click', createNewTodo);

// 리스너 함수, 데이터 생성
function createNewTodo() {
    // 새로운 아이템 객체 생성
    const item = {
        // getTime() -> 1970년부터 현재까지의 ms 나타냄, 유니크한 값을 얻기 위함
        id: new Date().getTime(),
        text: '',
        complete: false
    }

    // 배열 처음에 새로운 아이템 추가
    // unshift() 메소드 -> 배열의 첫번째에 엘리먼트를 insert 
    todos.unshift(item);

    // 화면에 보여주기 위한 요소 생성
    // 반환이 된 요소들을 저장
    const { itemEl, inputEl, editBtnEl, removeBtnEl } = createTodoElement(item);

    // prepend -> 노드를 첫번째 child 전에 넣어줌 pre + append
    // => 새로운 todo 요소를 추가하면 제일 위에 쌓이도록 함
    // 리스트 요소 안에 방금 생성한 아이템 요소 추가
    list.prepend(itemEl);

    // 요소가 생기면 클릭해서 타이핑을 할 수 있게 됨
    inputEl.removeAttribute('disabled');

    // 포커스를 넣어주면 클릭하지 않아도 요소가 생기자마자 키보드 입력으로 타이핑 할 수 있게 됨
    inputEl.focus();

    // 새로운 Todo를 생성하고 바로 로컬 저장소에 데이터 저장 
    saveToLocalStorage();
}

// 요소 생성 함수
function createTodoElement(item) {
    // div 요소 생성
    const itemEl = document.createElement("div");
    // dic 요소에 item 클래스 지정
    itemEl.classList.add("item");

    // type이 checkbox인 input 요소 생성
    const checkboxEl = document.createElement("input");
    checkboxEl.type = "checkbox";
    // 로컬 저장소에 저장된 데이터대로 체크 여부 반영
    checkboxEl.checked = item.complete;

    // item의 complete 값이 true일 때
    if (item.complete) {
        // itemEl에 complete 클래스 지정
        itemEl.classList.add("complete");
    }

    // type이 text인 input 요소 생성
    const inputEl = document.createElement("input");
    inputEl.type = "text";
    // input 요소의 텍스트 값이 item 객체의 text로 저장
    inputEl.value = item.text;
    // input 요소에 disabled가 들어가면 텍스트를 입력할 수 없음 
    // 처음 요소가 생성될 땐 텍스트 입력 불가
    inputEl.setAttribute("disabled", "");

    const actionsEl = document.createElement("div");
    actionsEl.classList.add("actions");

    const editBtnEl = document.createElement("button");
    editBtnEl.classList.add("material-icons");
    editBtnEl.innerText = "edit";

    const removeBtnEl = document.createElement("button");
    removeBtnEl.classList.add("material-icons", "remove-btn");
    removeBtnEl.innerText = "remove_circle";
    // 여기까지는 요소 생성. div 요소 안으로 넣어주는 추가 동작이 필요 


    // 체크박스의 상태가 바뀌면 
    checkboxEl.addEventListener('change', () => {
        // todo 요소의 complete 값을 체크된 상태로 변경
        item.complete = checkboxEl.checked;

        // complete가 true면 div 요소에 class로 complete가 들어감
        if (item.complete) {
            itemEl.classList.add('complete');
        }
        // complete가 false면 div 요소에 class로 complete가 들어감
        else {
            itemEl.classList.remove('complete');
        }

        // 체크 박스 체크 여부도 저장하기 위한 함수 호출
        saveToLocalStorage();
        // 여기까지 하면 데이터 저장은 되지만 웹 페이지에 반영은 안 됨
    })

    // inputEl가 포커스 상태가 아닐 때(다른 요소를 선택했을 때)
    inputEl.addEventListener('blur', () => {
        // 텍스트 입력 불가능 
        inputEl.setAttribute('disabled', '');

        // 텍스트 입력 후 블러 -> 입력한 텍스트가 로컬 저장소에 저장되어야 함
        saveToLocalStorage();
    })

    // 입력된 텍스트를 생성된 todo 요소의 텍스트로 저장
    inputEl.addEventListener('input', () => {
        item.text = inputEl.value;
    })

    // edit 버튼을 눌렀을 때 텍스트 입력 가능 + 포커스
    editBtnEl.addEventListener('click', () => {
        inputEl.removeAttribute('disabled');
        inputEl.focus();
    })

    // remove 버튼을 눌렀을 때 item 요소 + todo 데이터 모두 삭제 
    removeBtnEl.addEventListener('click', () => {
        // filter 메소드, 요소의 처음부터 순회하며 필터링을 걸 수 있음
        // item.id => 생성된 item 요소의 id
        // => todos 배열 내에서 클릭한 item 요소의 id와 다른 id들만 새로운 todos 배열로 반환
        // => 같은 id는 필터링되는 것
        todos = todos.filter(t => t.id !== item.id);

        // item 요소 삭제
        itemEl.remove();
        
        // 요소를 삭제하면 로컬 저장소에 데이터 삭제 반영 
        saveToLocalStorage();
    })

    // edit, remove 버튼 요소를 액션 엘리먼트 요소에 넣음
    actionsEl.append(editBtnEl);
    actionsEl.append(removeBtnEl);

    // checkbox, input 요소를 아이템 엘리먼트 요소에 넣음
    itemEl.append(checkboxEl);
    itemEl.append(inputEl);

    // 버튼 요소가 들어간 액션 엘리먼트 요소를 아이템 엘리먼트 요소에 넣음
    itemEl.append(actionsEl);

    // 엘리먼트 반환
    return { itemEl, inputEl, editBtnEl, removeBtnEl }
}

function saveToLocalStorage() {
    // stringify를 통해 데이터를 string 형식으로 변환하여 저장
    const data = JSON.stringify(todos);

    // window 객체 안에서 local storage의 setItem을 통해 로컬 저장소에 데이터 저장 가능
    // window.localStorage.setItem('my_todos', data);
    // window 는 생략 가능
    localStorage.setItem('my_todos', data);
}

// 로컬 저장소로부터 데이터를 가져옴 
function loadFromLocalStorage() {
    // 로컬 저장소의 투두 데이터를 가져와 data 라는 함수에 저장
    const data = localStorage.getItem('my_todos');

    // 만약 data 값이 존재한다면
    if(data)
    {
        // string을 object로 변환
        todos = JSON.parse(data);
    }
}

function displayTodos() {
    loadFromLocalStorage();
    
    // 배열 안의 객체 수만큼 순회
    for(let i = 0; i < todos.length; i++)
    {
            // 순회하면서 요소를 만듦
            const item = todos[i];

            // 새로 만든 요소에서 itemEl(div 요소) 반환
            const {itemEl} = createTodoElement(item)

            list.append(itemEl);
    };

}

// 스크립트가 실행되면 바로 데이터 로드 함수 실행 
//loadFromLocalStorage();
displayTodos();
