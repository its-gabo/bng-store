import { toPlainText } from "@react-email/components"
import { renderToReadableStream } from "react-dom/server"

import { EmailContent } from "./email-content"

export function emailTemplateFactory<T extends unknown[]>(
  template: (...args: T) => Parameters<typeof renderToReadableStream>[0]
): new (...args: T) => EmailContent {
  return class implements EmailContent {
    private readonly args: T

    constructor(...args: T) {
      this.args = args
    }

    get props(): T {
      return this.args
    }

    async getText(): Promise<string> {
      const html = await renderEmail(template(...this.props))
      return toPlainText(html)
    }

    async getHtml(): Promise<string> {
      return renderEmail(template(...this.props))
    }
  }
}

async function renderEmail(
  node: Parameters<typeof renderToReadableStream>[0]
): Promise<string> {
  const stream = await renderToReadableStream(node)
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let html = ""

  while (true) {
    const { done, value } = await reader.read()

    if (done) break

    html += decoder.decode(value, { stream: true })
  }

  html += decoder.decode()

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">${html.replace(/<!DOCTYPE.*?>/, "")}`
}
