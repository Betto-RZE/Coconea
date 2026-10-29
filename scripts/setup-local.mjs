import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
process.chdir(fileURLToPath(new URL("../", import.meta.url)));
if (Number(process.versions.node.split(".")[0]) < 24)
  throw new Error("Coconea requiere Node.js 24 o superior.");
for (const [source, target] of [
  [".env.example", ".env"],
  ["apps/customer/.env.example", "apps/customer/.env.local"],
  ["apps/restaurant/.env.example", "apps/restaurant/.env.local"],
]) {
  if (!existsSync(target))
    writeFileSync(target, readFileSync(source, "utf8"), { mode: 0o600 });
}
let environment = readFileSync(".env", "utf8");
if (
  environment.includes("coconea_development_secret_key_min_32_characters_long")
) {
  environment = environment.replace(
    "coconea_development_secret_key_min_32_characters_long",
    randomBytes(48).toString("base64url"),
  );
  writeFileSync(".env", environment, { mode: 0o600 });
}
console.log(
  "Configuración local lista. Los archivos existentes se conservan; el secreto de ejemplo se sustituye por uno aleatorio.",
);
if (!process.argv.includes("--env-only")) {
  const run = (program, args) =>
    execFileSync(program, args, { stdio: "inherit" });
  const pnpm = (args) =>
    process.platform === "win32"
      ? run("cmd.exe", ["/d", "/s", "/c", "pnpm " + args.join(" ")])
      : run("pnpm", args);
  if (!process.argv.includes("--skip-docker")) {
    try {
      execFileSync("docker", ["info", "--format", "{{.ServerVersion}}"], {
        stdio: "ignore",
        timeout: 15000,
      });
    } catch {
      console.error(
        "Docker no está disponible. Abre Docker Desktop desde Windows y espera a que el motor esté listo; después repite pnpm setup:local. Este comando no restablece Docker ni borra datos.",
      );
      process.exit(1);
    }
    run("docker", [
      "compose",
      "--env-file",
      ".env",
      "-f",
      "infrastructure/docker-compose.yml",
      "up",
      "-d",
      "--wait",
      "postgres",
    ]);
  }
  pnpm(["--filter", "@coconea/api", "db:migrate"]);
  pnpm(["--filter", "@coconea/api", "db:seed"]);
  console.log(
    "Preparación terminada. Accesos de restaurantes: tmp/restaurant-accounts.json. Ejecuta pnpm dev; consumidores en http://localhost:3000 y restaurantes en http://localhost:3001.",
  );
}
