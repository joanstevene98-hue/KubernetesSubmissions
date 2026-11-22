const TODO_BACKEND_URL = process.env.TODO_BACKEND_URL
const RANDOM_ARTICLE_URL = process.env.RANDOM_ARTICLE_URL

const main = async () => {
  if (!TODO_BACKEND_URL || !RANDOM_ARTICLE_URL) {
    throw new Error('TODO_BACKEND_URL and RANDOM_ARTICLE_URL are required')
  }

  // Special:Random answers with a redirect, the article is in the location header
  const response = await fetch(RANDOM_ARTICLE_URL, {
    redirect: 'manual',
    headers: { 'User-Agent': 'dwk-todo-cronjob/1.0' },
  })
  const location = response.headers.get('location')
  if (!location) throw new Error(`No location header (status ${response.status})`)
  const articleUrl = new URL(location, RANDOM_ARTICLE_URL).href

  const text = `Read ${articleUrl}`
  const created = await fetch(`${TODO_BACKEND_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (!created.ok) throw new Error(`Backend responded ${created.status}`)
  console.log(`Created todo: ${text}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
