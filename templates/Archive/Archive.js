import { gql } from '@apollo/client'
import SiteLayout from 'components/SiteLayout/SiteLayout'
import SiteFooter from 'components/SiteFooter/SiteFooter'
import ExtensionPreview, { ExtensionFragment } from 'components/ExtensionPreview/ExtensionPreview'
import RecipePreview, { RecipePreviewFragment } from 'components/RecipePreview/RecipePreview'
import FilterPreview, { FilterPreviewFragment } from 'components/FilterPreview/FilterPreview'
import FunctionPreview, { FunctionPreviewFragment } from 'components/FunctionPreview/FunctionPreview'
import ActionPreview, { ActionPreviewFragment } from 'components/ActionPreview/ActionPreview'

const Archive = {
  name: 'Archive',
}

Archive.variables = ({ uri }) => {
  return {
    uri,
  }
}

Archive.query = gql`
  query GetContentType($uri: String!) {
    archive: nodeByUri(uri: $uri,) {
      __typename
      id
      uri
      ...on ContentType {
        name
        description
        label
        contentNodes(first:100) {
          nodes {
            __typename
            ...ExtensionPreview
            ...RecipePreview
            ...FilterPreview
            ...FunctionPreview
            ...ActionPreview
          }
        }
      }
      ...on TermNode {
        name
        description
        ...on CodeSnippetTag {
          contentNodes(first:100) {
            nodes {
              __typename
              ...ExtensionPreview
              ...RecipePreview
              ...FilterPreview
              ...FunctionPreview
              ...ActionPreview
            }
          }
        }
      }
    }
  }
  ${ExtensionFragment}
  ${RecipePreviewFragment}
  ${FilterPreviewFragment}
  ${FunctionPreviewFragment}
  ${ActionPreviewFragment}
`

Archive.loading = () => {
  <h2>Loading...</h2>
}

Archive.error = () => {
  <h2>Error...</h2>
}

Archive.component = ({ data: { archive } }) => (
  <>
    <SiteLayout>
    <div className="overflow-hidden">
        <div className="mx-auto mt-10 px-4 pb-6 sm:mt-16 sm:px-6 md:px-8 xl:px-12 xl:max-w-4xl">
          <header className='text-center'>
            <h1 className="mb-6 text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
              {archive?.label ? archive.label : ( archive?.name ?? 'Archive' )}
            </h1>
            <p className="text-lg leading-7 prose dark:prose-dark">
              <span dangerouslySetInnerHTML={{__html: archive?.description }} />
            </p>
          </header>
          <main className="relative pt-10 max-w-3xl mx-auto">
            
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {archive?.contentNodes?.nodes?.map((node) => {
                  
                  switch (node.__typename) {
                    case 'ExtensionPlugin':
                      return <ExtensionPreview key={node.id} extension={node} />
                    case 'CodeSnippet':
                      return <RecipePreview key={node.id} recipe={node} />
                    case 'Filter':
                      return <FilterPreview key={node.id} filter={node} />
                    case 'Function':
                      return <FunctionPreview key={node.id} node={node} />
                    case 'Action':
                      return <ActionPreview key={node.id} node={node} />
                    default:
                      return(
                        <li key={node.id} className="py-12">
                          <pre>{JSON.stringify(node, null, 2)}</pre>
                        </li>
                      )
                  }
                
                })}
              </ul>
            </main>
          </div>
      </div>
      <SiteFooter />
    </SiteLayout>
  </>
)

export default Archive
