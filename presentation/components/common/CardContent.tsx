'use client'

interface Props {
  title: string
  description: string
  price: number
  location: string
}

export default function CardContentComponent(props: Props) {
  return (
    <div className="p-4 flex-1 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
          {props.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm line-clamp-2">
          {props.description}
        </p>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
          ฿{props.price.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-37.5">
          {props.location}
        </p>
      </div>
    </div>
  )
}
