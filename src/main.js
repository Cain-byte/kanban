const emojis = ["📝","📚","💻","🔥","🚀","🎯","📖","🧠","✨","🏆"];

function changeEmoji() {
  const random = Math.floor(Math.random() * emojis.length);
  document.getElementById("emoji").textContent = emojis[random];
}

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (text === "") return;

  const li = document.createElement("li");
  li.textContent = text;

  const btn = document.createElement("button");
  btn.textContent = "X";
  btn.onclick = () => li.remove();

  li.appendChild(btn);
  document.getElementById("taskList").appendChild(li);

  input.value = "";
  changeEmoji();
}

function clearTasks() {
  document.getElementById("taskList").innerHTML = "";
  document.getElementById("emoji").textContent = "📝";
}

async function downloadTasks() {
  const tasks = Array.from(document.querySelectorAll("#taskList li"))
    .map(li => li.firstChild.textContent)
    .join("\n");

  if (!tasks) {
    alert("Não há tarefas para baixar.");
    return;
  }

  const { save } = await import("@tauri-apps/plugin-dialog");
  const { writeTextFile } = await import("@tauri-apps/plugin-fs");

  const path = await save({
    filters: [{ name: "Texto", extensions: ["txt"] }],
    defaultPath: "tarefas.txt",
  });

  if (!path) return;
  await writeTextFile(path, tasks);
}

document.getElementById("btnAdd").addEventListener("click", addTask);
document.getElementById("btnClear").addEventListener("click", clearTasks);
document.getElementById("btnDownload").addEventListener("click", downloadTasks);

document.getElementById("taskInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});