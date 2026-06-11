'use client'

import { toc } from 'mdast-util-toc'
import { remark } from 'remark'
import { visit } from 'unist-util-visit'
import type { Root, RootContent, List, ListItem } from 'mdast'

const textTypes = ['text', 'emphasis', 'strong', 'inlineCode']

function flattenNode(node: RootContent): string {
  const p: string[] = []
  visit(node, (n: any) => {
    if (!textTypes.includes(n.type)) return
    if (typeof n.value === 'string') {
      p.push(n.value)
    }
  })
  return p.join('')
}

export interface Item {
  title: string
  url: string
  items?: Item[]
}

export interface Items {
  items?: Item[]
}

function getItems(node: RootContent | null | undefined, current: Item, level = 1): Items {
  if (!node) return current

  if (node.type === 'paragraph') {
    visit(node, (item: any) => {
      if (item.type === 'link') {
        current.url = item.url
        current.title = flattenNode(node)
      } else if (item.type === 'text') {
        current.title = flattenNode(node)
      }
    })
    return current
  }

  if (node.type === 'list') {
    if (level >= 3) return current
    const list = node as List
    current.items = list.children.map(
      (i: any) => getItems(i, { title: '', url: '' }, level + 1) as Item
    )
    return current
  }

  if (node.type === 'listItem') {
    const listItem = node as ListItem
    const heading = getItems(listItem.children[0], { title: '', url: '' }, level)
    if (listItem.children.length > 1) {
      getItems(listItem.children[1], heading as Item, level)
    }
    return heading
  }

  return current
}

function updateUrlsWithIncrement(items?: Item[], counter = { count: 1 }): Item[] | undefined {
  return items?.map((item) => {
    const newItem: Item = {
      ...item,
      url: `#header-${counter.count++}`,
    }

    if (item.items) {
      newItem.items = updateUrlsWithIncrement(item.items, counter)
    }

    return newItem
  })
}

function getToc() {
  return (node: Root, file: any) => {
    const table = toc(node)
    const items = getItems(table.map as RootContent, { title: '', url: '' }, 1)
    file.data = updateUrlsWithIncrement(items.items)
  }
}

export type TableOfContents = Items

export async function getTableOfContents(content: string): Promise<TableOfContents> {
  const result = await remark().use(getToc).process(content)
  return result.data as TableOfContents
}
