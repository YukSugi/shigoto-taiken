import { execFile } from "node:child_process";

/**
 * Windowsトースト通知（ベストエフォート）。失敗してもコンソール出力で代替。
 */
export function notify(title: string, message: string): void {
  // コンソールには必ず出す
  console.log(`\n🔔 ${title}\n${message}\n`);

  if (process.platform !== "win32") return;

  const safe = (s: string) => s.replace(/'/g, "''");
  const ps = `
$ErrorActionPreference='SilentlyContinue'
[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType=WindowsRuntime] | Out-Null
$template = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02)
$texts = $template.GetElementsByTagName('text')
$texts.Item(0).AppendChild($template.CreateTextNode('${safe(title)}')) | Out-Null
$texts.Item(1).AppendChild($template.CreateTextNode('${safe(message)}')) | Out-Null
$toast = [Windows.UI.Notifications.ToastNotification]::new($template)
[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('お仕事体験ドットコム').Show($toast)
`;
  execFile(
    "powershell.exe",
    ["-NoProfile", "-NonInteractive", "-Command", ps],
    () => {
      /* 失敗は無視（コンソール出力済み） */
    }
  );
}
