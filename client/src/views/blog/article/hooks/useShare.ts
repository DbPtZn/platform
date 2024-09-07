import { useDialog, useMessage } from "naive-ui"

export function useShare() {
  const message = useMessage()
  const dialog = useDialog()
  return async (title: string) => {
    try {
      const text = `【${title}】 ${window.location.href}`
      if(navigator.clipboard) {
        await navigator.clipboard.writeText(text)
        message.success('分享链接复制成功')
      } else {
        dialog.create({
          title: '浏览器安全策略限制，请手动复制',
          content: text,
          positiveText: '确定',
          negativeText: '取消',
        })
      }
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }
}