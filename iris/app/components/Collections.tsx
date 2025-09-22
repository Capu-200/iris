const callouts = [
    {
      name: 'Veja 2025',
      description: 'Collection Automne-Hiver 2025',
      imageSrc: 'https://media.veja-store.com/image/upload/f_auto/t_sfcc-banner-lb-desktop-hd/v1/VEJA/ECOM/LOOKBOOKS/AW25/LOOKBOOK%20MAINLINE%20AW25/DESKTOP/1_8',
      imageAlt: 'Chaussures Veja.',
      href: '/products',
    },
    {
      name: 'MoEa',
      description: 'Collection 2nde Life',
      imageSrc: 'https://moea.io/cdn/shop/files/PAIRE_SECOND_LIFE_3.jpg?v=1757512233&width=1000',
      imageAlt: 'Chaussures MoEa.',
      href: '/products',
    },
    {
      name: 'Veja 2024',
      description: 'Running automne-hiver 2024',
      imageSrc: 'https://media.veja-store.com/image/upload/f_auto/c_crop,h_4091,w_4910,y_1296/q_auto/v1/VEJA/2024/AW/LOOKBOOK/10_RUNNING%20LANZAROTE/VEJA_CONDOR_3_LANZAROTE_AW24_20',
      imageAlt: 'Chaussures Veja.',
      href: '/products',
    },
  ]
  
  export default function Collections() {
    return (
      <div className="bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
            <h2 className="text-2xl font-bold text-gray-900">Collections</h2>
  
            <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:space-y-0 lg:gap-x-6">
              {callouts.map((callout) => (
                <div key={callout.name} className="group relative">
                  <img
                    alt={callout.imageAlt}
                    src={callout.imageSrc}
                    className="w-full rounded-lg bg-white object-cover group-hover:opacity-75 max-sm:h-80 sm:aspect-2/1 lg:aspect-square"
                  />
                  <h3 className="mt-6 text-sm text-gray-500">
                    <a href={callout.href}>
                      <span className="absolute inset-0" />
                      {callout.name}
                    </a>
                  </h3>
                  <p className="text-base font-semibold text-gray-900">{callout.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  