import { TabsWithUnderline } from '~/components/tabs/TabsWithUnderline'

const tabs = [
  { name: 'Overview', to: '/dashboard', current: false },
  { name: 'Collections', to: '/dashboard/collections', current: true },
]

export default function Collections() {
  return (
    <div className='ml-16'>
      <TabsWithUnderline tabs={tabs} />
      <div className='mx-auto max-w-7xl py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          <div className='h-96 rounded-lg border-4 border-dashed border-gray-200'>
            {/* {loaderData.map((item) => (
              <CollectionCard key={item.id} name={item.name} />
            ))}
            <EmptyCollectionCard /> */}
            Collections
          </div>
        </div>
      </div>
    </div>
  )
}
