const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
let gameRecords = [];
let gameNumber = 1;

function getRandomNumber() {
  let number = new Set();
  while (number.size < 3) {
    number.add(Math.floor(Math.random() * 9) + 1);
  }
  console.log(Array.from(number)); //출력방식만 수정정
  return Array.from(number);
}

function getHint(computer, user) {
  const strike = computer.filter((num, idx) => num === user[idx]).length;
  const ball = user.filter((num) => computer.includes(num)).length - strike;
  return { strike, ball };
}

function tryCount() {
  let inputCount = 1;
  return function () {
    return inputCount++;
  };
}

function playGame() {
  console.log("컴퓨터가 숫자를 뽑았습니다.");
  const computerNumbers = getRandomNumber();
  const currentTry = tryCount(); // 시도 횟수를 추적할 클로저 함수 호출
  let startTime = new Date();
  let gameHistory = [];

  function askForNumber() {
    rl.question("숫자를 입력해주세요: ", (input) => {
      if (!/^[1-9]{3}$/.test(input) || new Set(input).size !== 3) {
        console.log("1 ~ 9 까지 서로 다른 세 자리 숫자를 입력하세요.");
        return askForNumber();
      }

      const tries = currentTry(); // 클로저 함수를 호출하여 시도 횟수를 추적
      const userNumber = input.split("").map(Number);
      
      const { strike, ball } = getHint(computerNumbers, userNumber);

      console.log(`${tries} 회 시도: ${strike}스트라이크 ${ball}볼`); // 시도 횟수 출력

      gameHistory.push({
        input: userNumber.join(""),
        result: `${strike}스트라이크 ${ball}볼`,
      });

      if (strike === 3) {
        console.log(`${tries} 회 만에 정답을 맞추셨습니다! 사용자 승리!`);
        console.log("-------게임 종료-------");
        gameRecords.push({
          gameNo: gameNumber++,
          startTime: startTime.toLocaleString(),
          endTime: new Date().toLocaleString(),
          attempts: tries, // 시도 횟수를 기록
          history: gameHistory,
        });
        return start();
      }

      if (tries === 5) {
        console.log("남은 시도 횟수가 없습니다. 컴퓨터 승리!");
        console.log(`정답은 ${computerNumbers} 입니다.`);
        start();
      }

      askForNumber();
    });
  }
  askForNumber();
}

function viewRecords() {
  if (gameRecords.length === 0) {
    console.log("저장된 게임 기록이 없습니다.");
    return start();
  }
  console.log("게임 기록 : ");
  gameRecords.forEach((record) => {
    console.log(
      `[${record.gameNo}] / 시작시간: ${record.startTime} / 종료시간: ${record.endTime} / 횟수: ${record.attempts}`
    );
  });
  rl.question("확인할 게임 번호를 입력하세요 (종료하려면 0을 입력): ", (input) => {
    const gameId = parseInt(input);
    if (gameId === 0) return start();
    const selectedGame = gameRecords.find((game) => game.gameNo === gameId);
    if (!selectedGame) {
      console.log("잘못된 게임 번호입니다.");
      return viewRecords();
    }
    console.log(`${gameId}번 게임 결과`);
    selectedGame.history.forEach((entry) => {
      console.log(`숫자를 입력해주세요: ${entry.input} / ${entry.result}`);
    });
    console.log("기록 종료");
    return viewRecords();
  });
}

function start() {
  rl.question(
    "게임을 시작하려면 1, 기록을 보려면 2, 종료하려면 9를 입력하세요.",
    (input) => {
      if (input == 1) {
        playGame();
      } else if (input == 2) {
        viewRecords();
      } else if (input == 9) {
        console.log("애플리케이션이 종료되었습니다.");
        rl.close();
      } else {
        console.log("잘못된 입력입니다. 1 또는 9를 입력하세요.");
        start();
      }
    }
  );
}

start();
