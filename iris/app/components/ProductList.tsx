const products = [
    {
      id: 1,
      name: 'V-90 Leather White Cyprus',
      href: '',
      imageSrc: 'https://media.veja-store.com/images/t_sfcc-pdp-desktop-v2/f_auto/v1756413464/VEJA/PACKSHOTS/VD2003384_5/veja-baskets-v-90-cuir-biologique-blanc-vd2003384_5.jpg',
      imageAlt: "Chaussures Veja",
      price: '165€',
      color: 'Vert',
    },
    {
      id: 2,
      name: 'Panenka suede grenat sun bark',
      href: '',
      imageSrc: 'https://media.veja-store.com/images/t_sfcc-pdp-desktop-v2/f_auto/v1739229225/VEJA/PACKSHOTS/FU0320897_2/veja-baskets-panenka-suede-rouge-fu0320897_2.jpg',
      imageAlt: "Chaussures Veja.",
      price: '140€',
      color: 'Grenat',
    },
    {
      id: 3,
      name: 'GEN8 - Smiley x MoEa Nature Drop',
      href: '',
      imageSrc: 'https://moea.io/cdn/shop/files/Gen8_20smiley-profil.jpg?v=1740566551&width=1600',
      imageAlt: "Chaussures MoEa.",
      price: '185€',
      color: 'Beige',
    },
    {
      id: 4,
      name: 'GEN9 - Corn White & Black Grained',
      href: '',
      imageSrc: 'https://moea.io/cdn/shop/files/Plan_20de_20travail_2012-min.png?v=1743755687&width=1400',
      imageAlt: "Chaussures MoEa.",
      price: '139€',
      color: 'Blanc & noir',
    },
  ]
  
  export default function ProductList() {
    return (
      <div className="bg-gray-50">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Nos clients adorent</h2>
  
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <div key={product.id} className="group relative">
                <img
                  alt={product.imageAlt}
                  src={product.imageSrc}
                  className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                />
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href={product.href}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  