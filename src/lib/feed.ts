import fs from "fs"
import path from "path"
import { remark } from "remark"
import html from "remark-html"
import matter from "gray-matter"
import moment from "moment"

import type { FeedItem } from "@/types/feed"

// Update the path to work with Next.js App Router directory structure
const feedsDirectory = path.join(process.cwd(), "src", "feed")

/**
 * Gets all feed items sorted by date (newest first)
 */
export const getSortedFeeds = (): FeedItem[] => {
    // Ensure the directory exists
    if (!fs.existsSync(feedsDirectory)) {
        console.error(`Feeds directory not found: ${feedsDirectory}`)
        return []
    }

    try {
        const fileNames = fs.readdirSync(feedsDirectory)

        const allFeedsData = fileNames
            .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
            .map((fileName) => {
                try {
                    const id = fileName.replace(/\.(md|mdx)$/, "")
                    const fullPath = path.join(feedsDirectory, fileName)
                    const fileContents = fs.readFileSync(fullPath, "utf-8")
                    const matterResult = matter(fileContents)

                    return {
                        id,
                        title: matterResult.data.title || 'Untitled',
                        date: matterResult.data.date, 
                        category: matterResult.data.category || 'Uncategorized',
                        excerpt: matterResult.data.excerpt,
                        author: matterResult.data.author,
                        tags: matterResult.data.tags,
                        coverImage: matterResult.data.coverImage,
                    }
                } catch (error) {
                    console.error(`Error processing file ${fileName}:`, error)
                    return null
                }
            })
            .filter(Boolean) as FeedItem[]

        // Sort by date, newest first
        return allFeedsData.sort((a, b) => {
            const format = "DD-MM-YYYY"
            const dateA = moment(a.date, format)
            const dateB = moment(b.date, format)

            if (dateA.isValid() && dateB.isValid()) {
                return dateB.valueOf() - dateA.valueOf() // Newest first
            }
            
            return 0
        })
    } catch (error) {
        console.error("Error getting sorted feeds:", error)
        return []
    }
} 

/**
 * Categorizes feed items by their category
 */
export const getCategorisedFeeds = (): Record<string, FeedItem[]> => {
    const sortedFeeds = getSortedFeeds()
    const categorisedFeed: Record<string, FeedItem[]> = {}

    sortedFeeds.forEach(feed => {
        if (!categorisedFeed[feed.category]) {
            categorisedFeed[feed.category] = []
        }
        categorisedFeed[feed.category].push(feed)
    })

    return categorisedFeed
}

/**
 * Gets a specific feed item by ID with HTML content
 */
export const getFeedById = async (id: string): Promise<(FeedItem & { contentHtml: string }) | null> => {
    try {
        // Check for both .md and .mdx extensions
        let fullPath = path.join(feedsDirectory, `${id}.md`);
        let exists = fs.existsSync(fullPath);
        
        if (!exists) {
            fullPath = path.join(feedsDirectory, `${id}.mdx`);
            exists = fs.existsSync(fullPath);
        }
        
        if (!exists) {
            return null;
        }
        
        const fileContents = fs.readFileSync(fullPath, 'utf-8')
        const matterResult = matter(fileContents)
        
        // Process markdown content to HTML
        const processedContent = await remark()
            .use(html)
            .process(matterResult.content)
        
        const contentHtml = processedContent.toString()
        
        return {
            id,
            title: matterResult.data.title || 'Untitled',
            date: matterResult.data.date,
            category: matterResult.data.category || 'Uncategorized',
            excerpt: matterResult.data.excerpt,
            author: matterResult.data.author,
            tags: matterResult.data.tags,
            coverImage: matterResult.data.coverImage,
            contentHtml
        }
    } catch (error) {
        console.error(`Error retrieving feed by ID ${id}:`, error)
        return null
    }
}