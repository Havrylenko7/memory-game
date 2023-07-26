export function createArray(columns, rows) {
  let arr = [];

  for (let i = 0, s = columns * rows / 2; i < s; i++) {
    let num = Math.round(Math.random() * 99);
    !arr.includes(num) ? arr.push(num) : i--;
  }

  arr = [...arr, ...arr];
  const randArr = [];

  for (let i = 0, s = columns * rows; i < s; i++) {
    let r = Math.round(Math.random() * (arr.length - 1));
    randArr.push(arr[r]);
    arr.splice(r, 1);
  }

  return randArr;
}

export function createGridTemplate(data) {
  let style = ''
  
  for (let i = 0, d = data; i < d; i++) {
    style += ' 1fr';
  }

  return style.substring(1);
}
