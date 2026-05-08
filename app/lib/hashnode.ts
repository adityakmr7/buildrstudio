const HASHNODE_API_ENDPOINT =
  process.env.HASHNODE_GQL_ENDPOINT ?? "https://gql.hashnode.com/";
const HASHNODE_PUBLICATION_HOST =
  process.env.HASHNODE_PUBLICATION_HOST ?? "adityakmr.hashnode.dev";

const POSTS_QUERY = `
  query PublicationPosts($host: String!, $first: Int!, $after: String) {
    publication(host: $host) {
      title
      posts(first: $first, after: $after) {
        edges {
          node {
            id
            title
            brief
            slug
            publishedAt
            readTimeInMinutes
            url
            coverImage {
              url
            }
            tags {
              name
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

type HashnodeGraphqlResponse = {
  data?: {
    publication?: {
      title?: string | null;
      posts?: {
        edges?: Array<{
          node?: {
            id?: string | null;
            title?: string | null;
            brief?: string | null;
            slug?: string | null;
            publishedAt?: string | null;
            readTimeInMinutes?: number | null;
            url?: string | null;
            coverImage?: {
              url?: string | null;
            } | null;
            tags?: Array<{
              name?: string | null;
            }> | null;
          } | null;
        }> | null;
        pageInfo?: {
          hasNextPage?: boolean | null;
          endCursor?: string | null;
        } | null;
      } | null;
    } | null;
  };
  errors?: Array<{ message?: string }>;
};

export type BlogPost = {
  id: string;
  title: string;
  brief: string;
  url: string;
  slug: string;
  publishedAt: string;
  readTimeInMinutes: number;
  coverImageUrl: string | null;
  tags: string[];
};

export type BlogFeed = {
  publicationTitle: string;
  posts: BlogPost[];
};

export type PaginatedBlogFeed = BlogFeed & {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalPosts: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

type HashnodeBatchResult = {
  publicationTitle: string;
  posts: BlogPost[];
  hasNextPage: boolean;
  endCursor: string | null;
};

async function fetchPostsBatch(limit: number, after: string | null) {
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 20) : 6;

  const response = await fetch(HASHNODE_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: POSTS_QUERY,
      variables: {
        host: HASHNODE_PUBLICATION_HOST,
        first: safeLimit,
        after,
      },
    }),
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch blog posts.");
  }

  const payload = (await response.json()) as HashnodeGraphqlResponse;
  if (!payload.data?.publication || payload.errors?.length) {
    throw new Error("Blog data is unavailable.");
  }

  const publicationTitle = payload.data.publication.title?.trim() || "Hashnode Blog";
  const postsConnection = payload.data.publication.posts;
  const edges = postsConnection?.edges ?? [];
  const posts = edges
    .map((edge) => {
      const node = edge?.node;
      if (!node?.id || !node.title || !node.url || !node.slug || !node.publishedAt) {
        return null;
      }

      return {
        id: node.id,
        title: node.title,
        brief: node.brief ?? "Read the full article for complete details.",
        url: node.url,
        slug: node.slug,
        publishedAt: node.publishedAt,
        readTimeInMinutes: node.readTimeInMinutes ?? 1,
        coverImageUrl: node.coverImage?.url ?? null,
        tags: (node.tags ?? [])
          .map((tag) => tag.name?.trim())
          .filter((tagName): tagName is string => Boolean(tagName)),
      } satisfies BlogPost;
    })
    .filter((post): post is BlogPost => post !== null);

  return {
    publicationTitle,
    posts,
    hasNextPage: Boolean(postsConnection?.pageInfo?.hasNextPage),
    endCursor: postsConnection?.pageInfo?.endCursor ?? null,
  } satisfies HashnodeBatchResult;
}

export async function getHashnodePostsPage(
  page = 1,
  pageSize = 6,
): Promise<PaginatedBlogFeed> {
  const safePageSize = Number.isFinite(pageSize)
    ? Math.min(Math.max(Math.floor(pageSize), 1), 20)
    : 6;
  const requestedPage = Number.isFinite(page) ? Math.max(Math.floor(page), 1) : 1;

  const allPosts: BlogPost[] = [];
  let publicationTitle = "Hashnode Blog";
  let hasNextPage = true;
  let endCursor: string | null = null;
  let safetyCounter = 0;

  while (hasNextPage && safetyCounter < 100) {
    const batch = await fetchPostsBatch(safePageSize, endCursor);
    publicationTitle = batch.publicationTitle;
    allPosts.push(...batch.posts);
    hasNextPage = batch.hasNextPage;
    endCursor = batch.endCursor;
    safetyCounter += 1;
  }

  const totalPosts = allPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / safePageSize));
  const currentPage = Math.min(requestedPage, totalPages);
  const start = (currentPage - 1) * safePageSize;
  const end = start + safePageSize;
  const posts = allPosts.slice(start, end);

  return {
    publicationTitle,
    posts,
    currentPage,
    pageSize: safePageSize,
    totalPages,
    totalPosts,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
  };
}
