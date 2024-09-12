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
function createNewTodo() 
{
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
    const {itemEl, inputEl, editBtnEl, removeBtnEl} = createTodoElement(item);

    // prepend -> 노드를 첫번째 child 전에 넣어줌 pre + append
    // => 새로운 todo 요소를 추가하면 제일 위에 쌓이도록 함
    // 리스트 요소 안에 방금 생성한 아이템 요소 추가
    list.prepend(itemEl);
}

// 요소 생성 함수
function createTodoElement(item) 
{
    // div 요소 생성
    const itemEl = document.createElement("div");
    // dic 요소에 item 클래스 지정
    itemEl.classList.add("item");
    
    // type이 checkbox인 input 요소 생성
    const checkboxEl = document.createElement("input");
    checkboxEl.type = "checkbox";
    
    // item의 complete 값이 true일 때
    if(item.complete)
        {
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
        removeBtnEl.classList.add("material-icons-remove-btn");
        removeBtnEl.innerText = "remove_circles";
        // 여기까지는 요소 생성. div 요소 안으로 넣어주는 추가 동작이 필요 

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