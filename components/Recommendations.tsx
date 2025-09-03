'use client'

import { useState } from 'react'

interface Recommendation {
  id: string
  score: number
  content: string
  projectId: string
  createdAt: string
}

interface RecommendationsProps {
  recommendations: Recommendation[]
  onSelectRecommendation: (recommendation: Recommendation) => void
}

export default function Recommendations({ recommendations, onSelectRecommendation }: RecommendationsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!recommendations || recommendations.length === 0) {
    return null
  }

  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 text-xs font-light text-gray-500 hover:text-gray-700 transition-colors"
      >
        <span>💡 Похожие идеи ({recommendations.length})</span>
        <svg 
          className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="mt-3 space-y-2">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              onClick={() => onSelectRecommendation(rec)}
              className="p-3 bg-gray-50 rounded border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <p className="text-xs font-light text-gray-700 leading-relaxed">
                {rec.content}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">
                  {Math.round((rec.score || 0) * 100)}% совпадение
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(rec.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
