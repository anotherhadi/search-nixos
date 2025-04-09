/**
 * Formats text safely for rendering in SvelteKit
 * - Converts URLs to clickable links
 * - Formats command references like {command}`x`
 * - Formats file references like {file}`x`
 * - Escapes HTML to prevent XSS attacks
 */
export function formatTextSafely(text: string, muted: boolean = false): string {
  if (!text) return ''

  // Escape HTML first to prevent XSS
  let safeText = escapeHtml(text)

  // Format URLs in angle brackets <https://...>
  safeText = safeText.replace(/&lt;(https?:\/\/[^&]+)&gt;/g, (_, url) =>
    muted
      ? `<span class="text-foreground/80">${url.replace('https://', '')}</span>`
      : `<a href="${url}" target="_blank" rel="noopener noreferrer">${url.replace('https://', '')}</a>`,
  )

  // Format standalone URLs
  safeText = safeText.replace(/(?<!\S)(https?:\/\/[^\s<]+)(?!\S)/g, (_, url) =>
    muted
      ? `<span class="text-foreground/80">${url.replace('https://', '')}</span>`
      : `<a href="${url}" target="_blank" rel="noopener noreferrer">${url.replace('https://', '')}</a>`,
  )

  // Format command references: {command}`x`
  safeText = safeText.replace(
    /\{command\}`([^`]+)`/g,
    muted
      ? '<span class="file-ref"><code class="!bg-muted/50">$1</code></span>'
      : '<span class="file-ref"><code>$1</code></span>',
  )

  // Format file references: {file}`x`
  safeText = safeText.replace(
    /\{file\}`([^`]+)`/g,
    muted
      ? '<span class="file-ref"><code class="!bg-muted/50">$1</code></span>'
      : '<span class="file-ref"><code>$1</code></span>',
  )

  // Format file references: {var}`x`
  safeText = safeText.replace(
    /\{var\}`([^`]+)`/g,
    muted
      ? '<span class="var-ref"><code class="!bg-muted/50">$1</code></span>'
      : '<span class="var-ref"><code>$1</code></span>',
  )

  // Format inline code with single backticks (but not inside already processed tags)
  safeText = safeText.replace(/`([^`]+)`/g, (match, code) => {
    // Skip if this backtick content is already inside a code tag
    if (match.includes('<code>') || match.includes('</code>')) {
      return match
    }
    return muted
      ? `<code class="!bg-muted/50">${code}</code>`
      : `<code>${code}</code>`
  })

  return safeText
}

/**
 * Escapes HTML special characters to prevent XSS
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
