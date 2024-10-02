'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  closeMiniApp,
  exchangeToken,
  getAllmemberPoints,
  initSDK,
} from '@/app/utils/sdk'

export default function Home() {
  const [points, setPoints] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [loadingPoints, setLoadingPoints] = useState(false)
  const [loadingGame, setLoadingGame] = useState(false)
  const router = useRouter()

  useEffect(() => {
    initSDK()
  }, [])

  const fetchPoints = async () => {
    setLoadingPoints(true)
    try {
      const points = await getAllmemberPoints()
      setPoints(points)
    } catch (error) {
      console.error('Error fetching points:', error)
    } finally {
      setLoadingPoints(false)
    }
  }

  const startGame = async () => {
    if (!window.MiniAppSDK) return

    if (points && points > 1) {
      setLoadingGame(true)
      try {
        const tokenData = await exchangeToken()
        if (!tokenData?.accessToken) {
          throw new Error('Failed to obtain access token')
        }

        const response = await deductPoints(tokenData.accessToken)
        if (response.ok) {
          router.push('/game')
        } else {
          setShowModal(true)
        }
      } catch (error) {
        console.error('Error starting game:', error)
      } finally {
        setLoadingGame(false)
      }
    } else {
      setShowModal(true)
    }
  }

  const deductPoints = async (accessToken: string) => {
    return fetch(`/api/deduct-reward`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }

  const renderPointsButton = () => (
    <button
      className="ml-4 px-4 py-2 bg-red-500 text-white rounded"
      onClick={fetchPoints}
      disabled={loadingPoints}
    >
      {loadingPoints ? 'Loading...' : 'Get Points'}
    </button>
  )

  const renderStartGameButton = () => (
    <button
      onClick={startGame}
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      disabled={loadingGame}
    >
      {loadingGame ? 'Loading...' : 'Start Game (1 point)'}
    </button>
  )

  const renderModal = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded">
        <p>Insufficient points</p>
        <button
          onClick={() => setShowModal(false)}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="absolute top-10 right-4">
        <button
          onClick={closeMiniApp}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          X
        </button>
      </div>
      <h1 className="text-4xl font-bold">Let It Ride</h1>
      <p>
        Points:
        {points == null ? renderPointsButton() : points}
      </p>
      {!!points && renderStartGameButton()}
      {showModal && renderModal()}
    </div>
  )
}
