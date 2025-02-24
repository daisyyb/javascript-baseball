const readLine = require("readline");
const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let gameRecords = [];
let gameNumber = 1;

// 랜덤 숫자 생성
function getRandomNumber() {
    let number = new Set();
    while (number.size < 3) {
        number.add(Math.floor(Math.random() * 9) + 1);
    }
    let randomResult = Array.from(number);
    console.log(randomResult);
    return randomResult;
}

// 스트라이크, 볼 판정
function getHint(computer, user) {
    const strike = computer.filter((num, idx) => num === user[idx]).length;
    const ball = user.filter((num) => computer.includes(num)).length - strike;
    return { strike, ball };
}

// 게임 시작
function playGame() {
    console.log("컴퓨터가 숫자를 뽑았습니다.");
    const computerNumbers = getRandomNumber();
    let startTime = new Date();
    let attempt = 0;
    let gameHistory = [];

    // 숫자 입력
    function askForNumber() {
        rl.question("숫자를 입력해주세요: ", (input) => {
            if (!/^[1-9]{3}$/.test(input) || new Set(input).size !== 3) {
                console.log("1 ~ 9 까지 서로 다른 세 자리 숫자를 입력하세요.");
                return askForNumber();
            }
            attempt++;
            const userNumber = input.split("").map(Number);
            const { strike, ball } = getHint(computerNumbers, userNumber);
            gameHistory.push({
                input: userNumber.join(""),
                result: `${strike}스트라이크 ${ball}볼`,
            });
            console.log(`${strike}스트라이크 ${ball}볼`);
            if (strike == 3) {
                let endTime = new Date();
                console.log("3 스트라이크 / 3개의 숫자를 모두 맞히셨습니다.");
                console.log("------게임 종료------");
                gameRecords.push({
                    gameNo: gameNumber++,
                    startTime: startTime.toLocaleString(),
                    endTime: endTime.toLocaleString(),
                    attempt: attempt,
                    history: gameHistory,
                });
                return start();
            }
            askForNumber();
        });
    }
    askForNumber();
}

// 기록 보기
function viewRecords() {
    if (gameRecords.length == 0) {
        console.log("저장된 게임 기록이 없습니다.");
        return start();
    }
    console.log("게임 기록 : ");
    gameRecords.forEach((record) => {
        console.log(
            `[${record.gameNo}] / 시작시간: ${record.startTime} / 종료시간: ${record.endTime} / 횟수: ${record.attempt}`
        );
    });
    rl.question(
        "확인할 게임 번호를 입력하세요 (종료하려면 0을 입력): ",
        (input) => {
            const gameId = parseInt(input);
            if (gameId == 0) return start();
            const selectedGame = gameRecords.find((game) => game.gameNo == gameId);

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
        }
    );
}

// 통계 보기
function getAverage() {
    if (gameRecords.length == 0) {
        console.log("저장된 게임 기록이 없습니다.");
        return start();
    }
    let minRecord = gameRecords.reduce((min, game) => {
        if (game.attempt < min.attempt) {
            return game;
        }
        return min;
    }, gameRecords[0]);
    let maxRecord = gameRecords.reduce((max, game) => {
        if (game.attempt > max.attempt) {
            return game;
        }
        return max;
    }, gameRecords[0]);
    let totalAttempts = gameRecords.reduce((sum, game) => sum + game.attempt, 0);
    let attemptsAverage = totalAttempts / gameRecords.length;
    console.log(`가장 적은 횟수: ${minRecord.attempt}회 - [${minRecord.gameNo}]`);
    console.log(`가장 많은 횟수: ${maxRecord.attempt}회 - [${maxRecord.gameNo}]`);
    console.log(`평균 횟수: ${attemptsAverage}회`);
    console.log("--------통계 종료--------");
    start();
}

// 실행 입력
function start() {
    rl.question(
        "게임을 시작하려면 1, 기록을 보려면 2, 통계를 보려면 3, 종료하려면 9를 입력하세요.",
        (input) => {
            if (input == 1) {
                playGame();
            } else if (input == 2) {
                viewRecords();
            } else if (input == 3) {
                getAverage();
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





