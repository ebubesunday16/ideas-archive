import { getIdeasServerSide } from '@/services/IdeasDataServer'
import { Idea } from '@/types/ideas'
import { Star, Target, TrendingUp, Zap } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const IdeaCarousel = async () => {

    const { ideas: Ideas } : {ideas: Idea[]} = await getIdeasServerSide({})
    console.log(Ideas)


    


  return (
    <div className="relative mb-12">
              <div className="overflow-hidden rounded-2xl">
                <div className="flex gap-6 animate-scroll">
                    <div className="flex gap-6 min-w-full">
                    {
                        Ideas.map((item, index) => {
                            const getIcon: Record< 0 | 1 | 2 | 3, React.ReactNode> = {
                                0: <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-white" />
                              </div>,
                                1: <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                <Target className="w-4 h-4 text-white" />
                              </div>,
                                2: <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <Zap className="w-4 h-4 text-white" />
                              </div>,
                                3: <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                <Star className="w-4 h-4 text-white" />
                              </div>,
                            }

                            const getSpanColor: Record < 0 | 1 | 2 | 3, string > = {
                                0: "text-green-400",
                                1: "text-blue-400 ",
                                2: "text-purple",
                                3: "text-orange-400 "
                            }

                            return (
                                
                                    <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 min-w-80 hover:border-gray-600 transition-all duration-300 group">
                                    <div className="flex items-center gap-3 mb-4">
                                        {getIcon[index as 0 | 1 | 2 | 3]}
                                        <span className={`text-sm  font-medium ${getSpanColor[ index as 0 | 1 | 2 | 3 ]}`}>{item.main_keyword}</span>
                                    </div>
                                    <Link
                                    href={`/ideas/${item.id}`}
                                >
                                    <h3 className="text-lg font-semibold mb-2 group-hover:text-white transition-colors hover:underline">{item.title}</h3>
                                </Link>

                                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{item.excerpt}</p>
                                    </div>

                            )
                        })
                    }
                    </div>
                  
                </div>
              </div>
            </div>
  )
}

export default IdeaCarousel