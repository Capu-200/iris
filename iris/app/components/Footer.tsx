import Logo from '@/public/Logo-vert.svg'
import Image from 'next/image';

export const Footer = () => {
    return (
      <footer className="bg-gray-50">
          <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
              <div className="md:flex md:justify-between">
                <div className="mb-6 md:mb-0">
                    <a href="" className="flex items-center gap-1">
                      <Image className='w-5' src={Logo} alt='Logo en forme de fleur'/>
                      <span className="self-center text-2xl font-semibold whitespace-nowrap text-black">Iris</span>
                    </a>
                </div>
                <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                    <div>
                        <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">RSE / ESS</h2>
                        <ul className="text-gray-500 font-medium">
                            <li>
                                <a href="/rse" className="hover:underline">Nos démarches</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="mb-6 text-sm font-semibold text-gray-900">Follow us</h2>
                        <ul className="text-gray-500 font-medium">
                            <li className="mb-4">
                                <a href="https://github.com/Capu-200/iris.git" className="hover:underline ">Github</a>
                            </li>
                            <li>
                                <a href="https://discord.gg/4eeurUVvTy" className="hover:underline">Discord</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Legal</h2>
                        <ul className="text-gray-500 font-medium">
                            <li className="mb-4">
                                <a href="/confidentialite" className="hover:underline">Politique de confidentialité</a>
                            </li>
                            <li>
                                <a href="/cgv" className="hover:underline">Conditions Générales de ventes</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
            <div className="sm:flex sm:items-center sm:justify-between">
                <span className="text-sm text-gray-500 sm:text-center">© 2025 <a href="#" className="hover:underline">Iris</a>. Tous droits réservés.
                </span>
            </div>
          </div>
      </footer>
    );
  };