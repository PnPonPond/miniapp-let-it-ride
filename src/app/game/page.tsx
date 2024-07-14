'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const getRandomCard = () => Math.floor(Math.random() * 13) + 1

export default function Game() {
  const [currentCard, setCurrentCard] = useState(getRandomCard())
  const [showWinModal, setShowWinModal] = useState(false)
  const [showLoseModal, setShowLoseModal] = useState(false)
  const [result, setResult] = useState('')
  const [score, setScore] = useState(0)
  const router = useRouter()

  const guessHigher = () => {
    const nextCard = getRandomCard()
    setCurrentCard(nextCard)
    if (nextCard > currentCard) {
      handleWin(nextCard)
    } else {
      handleLose(nextCard)
    }
  }

  const guessLower = () => {
    const nextCard = getRandomCard()
    setCurrentCard(nextCard)
    if (nextCard < currentCard) {
      handleWin(nextCard)
    } else {
      handleLose(nextCard)
    }
  }

  const handleWin = async (nextCard: number) => {
    if (score + 1 === 1) {
      // User wins and gets a coupon
      const response = await axios.get('/api/get-coupon')
      setResult(`You won! Coupon: ${response.data.coupon}`)
      setScore(0) // Reset score after getting coupon
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
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Higher
          </button>
          <button
            onClick={guessLower}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Lower
          </button>
        </div>
      </div>

      {showWinModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-80 h-60 border-2 border-gray-300 rounded-lg bg-white p-4 flex flex-col items-center justify-center">
            <div className="w-24 h-36 border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4">
              <h1 className="text-4xl font-bold">{currentCard}</h1>
            </div>
            <p>{result}</p>
            <button
              onClick={() => setShowWinModal(false)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Next Round
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
