//https://blog.codeship.com/unleash-the-power-of-storing-json-in-postgres/

async function asyncFunction(x) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('timeout finish: ', x);
      resolve(x);
    }, 1000)
  });
}

async function main() {
  const test = {
    0: 0, 
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9
  };
  
  for (i in test) {
    const result = await asyncFunction(i);
    console.log('awaited, ', result);
  }

  for (let i = 0; i < 10; i++) {
    const result = await asyncFunction(i);
    console.log('awaited, ', result);
  }
}

main();

//https://blog.codeship.com/unleash-the-power-of-storing-json-in-postgres/