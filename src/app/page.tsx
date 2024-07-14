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
  const router = useRouter()

  const getPoints = async () => {
    const points = await getAllmemberPoints()
    setPoints(points)
  }

  useEffect(() => {
    initSDK()
  }, [])

  const startGame = async () => {
    if (!window.MiniAppSDK) return

    if (points && points > 1) {
      try {
        const data = await exchangeToken()
        const response = await fetch(`/api/deduct-reward`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${data?.accessToken}`,
          },
        })

        if (response.ok) {
          router.push('/game')
        } else {
          setShowModal(true)
        }
      } catch (error) {
        console.log('🔥  error:', error)
      }
    } else {
      setShowModal(true)
    }
  }

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
        points:
        {points == null ? (
          <button
            className="ml-4 px-4 py-2 bg-red-500 text-white rounded"
            onClick={getPoints}
          >
            getPoints
          </button>
        ) : (
          points
        )}
      </p>
      {!!points && (
        <button
          onClick={startGame}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Start Game (1 points)
        </button>
      )}

      {showModal && (
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
      )}
    </div>
  )
}
