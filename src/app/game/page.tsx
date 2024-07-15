'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { getCoupon } from '@/app/api/get-coupon/actions'
import { exchangeToken } from '@/app/utils/sdk'
import { getCouponDetail } from '@/app/api/get-coupon-detail/actions'

const getRandomCard = () => Math.floor(Math.random() * 13) + 1

export default function Game() {
  const [currentCard, setCurrentCard] = useState(getRandomCard())
  const [showWinModal, setShowWinModal] = useState(false)
  const [showLoseModal, setShowLoseModal] = useState(false)
  const [result, setResult] = useState('')
  const [score, setScore] = useState(0)
  const [couponImage, setCouponImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const guessHigher = async () => {
    setLoading(true)
    try {
      const nextCard = getRandomCard()
      setCurrentCard(nextCard)
      if (nextCard > currentCard) {
        await handleWin(nextCard)
      } else {
        handleLose(nextCard)
      }
    } finally {
      setLoading(false)
    }
  }

  const guessLower = async () => {
    setLoading(true)
    try {
      const nextCard = getRandomCard()
      setCurrentCard(nextCard)
      if (nextCard < currentCard) {
        await handleWin(nextCard)
      } else {
        handleLose(nextCard)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleWin = async (nextCard: number) => {
    if (score + 1 === 1) {
      const data = await exchangeToken()
      // User wins and gets a coupon
      if (data?.accessToken) {
        const coupon = await getCouponDetail(data.accessToken)
        console.log('🔥  coupon:', coupon)
        if (coupon) {
          await getCoupon(data.accessToken)
        }

        setResult(`You won! Coupon: ${coupon.name}`)
        setCouponImage(coupon.imageUrl) // Set the coupon image URL in state
        setScore(0) // Reset score after getting coupon
      }
    } else {
      setResult(`Correct!`)
      setScore(score + 1)
    }
    setCurrentCard(nextCard) // Update the card to show in the modal
    setShowWinModal(true)
  }

  const handleLose = (nextCard: number) => {
    setResult(`You lost!`)
    setCurrentCard(nextCard) // Update the card to show in the modal
    setScore(0) // Reset score on loss
    setShowLoseModal(true)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold">Card Game: Let It Ride</h1>
        <h2 className="text-2xl mt-2">Score: {score}</h2>
      </div>
      <div className="flex flex-col items-center mt-6">
        <div className="w-24 h-36 border-2 border-gray-300 rounded-lg flex items-center justify-center">
          <h1 className="text-4xl font-bold">{currentCard}</h1>
        </div>
        <div className="flex space-x-4 mt-4">
          <button
            onClick={guessHigher}
            className={`px-4 py-2 rounded ${
              loading ? 'bg-gray-500' : 'bg-green-500 text-white'
            }`}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Higher'}
          </button>
          <button
            onClick={guessLower}
            className={`px-4 py-2 rounded ${
              loading ? 'bg-gray-500' : 'bg-red-500 text-white'
            }`}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Lower'}
          </button>
        </div>
      </div>

      {showWinModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-80 h-80 border-2 border-gray-300 rounded-lg bg-white p-4 flex flex-col items-center justify-center">
            <div className="w-24 h-36 border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4">
              <h1 className="text-4xl font-bold">{currentCard}</h1>
            </div>
            <p>{result}</p>
            {couponImage && (
              <img src={couponImage} alt="Coupon" className="w-24 h-24 mt-2" />
            )}
            <button
              onClick={() => router.push('/')}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              End.
            </button>
          </div>
        </div>
      )}

      {showLoseModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-80 h-60 border-2 border-gray-300 rounded-lg bg-white p-4 flex flex-col items-center justify-center">
            <div className="w-24 h-36 border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4">
              <h1 className="text-4xl font-bold">{currentCard}</h1>
            </div>
            <p>{result}</p>
            <button
              onClick={() => router.push('/')}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
