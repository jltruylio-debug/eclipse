import "./style.css";
import { Game } from "./core/Game";

const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas");
if (!canvas) throw new Error("Canvas principal não encontrado.");

const game = new Game(canvas);

const menu = document.querySelector<HTMLElement>("#main-menu")!;
const hud = document.querySelector<HTMLElement>("#hud")!;
const mobileControls = document.querySelector<HTMLElement>("#mobile-controls")!;
const pauseOverlay = document.querySelector<HTMLElement>("#pause-overlay")!;
const startButton = document.querySelector<HTMLButtonElement>("#start-button")!;
const resumeButton = document.querySelector<HTMLButtonElement>("#resume-button")!;

function startGame(): void {
  menu.classList.add("hidden");
  hud.classList.remove("hidden");
  if (game.isTouchDevice) mobileControls.classList.remove("hidden");
  game.start();
}

function pauseGame(): void {
  if (!game.started || game.paused) return;
  game.pause();
  pauseOverlay.classList.remove("hidden");
}

function resumeGame(): void {
  game.resume();
  pauseOverlay.classList.add("hidden");
}

startButton.addEventListener("click", startGame);
resumeButton.addEventListener("click", resumeGame);
window.addEventListener("keydown", (event) => {
  if (event.code === "Escape") {
    if (pauseOverlay.classList.contains("hidden")) pauseGame();
    else resumeGame();
  }
});

game.initialize();
