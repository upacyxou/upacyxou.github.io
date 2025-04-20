import { useState } from 'react'

const ZoraAllocationChecker = () => {
  const [address, setAddress] = useState('')
  const [allocation, setAllocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const checkAllocation = async () => {
    if (!address) {
      setError('Please enter a wallet address')
      return
    }

    setLoading(true)
    setError('')
    setAllocation(null)

    try {
      const response = await fetch('https://api.zora.co/universal/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query graph {
              zoraTokenAllocation(identifierWalletAddresses: "${address}") {
                totalTokensEarned {
                  totalTokens
                }
              }
            }
          `,
        }),
      })

      const data = await response.json()

      if (data.errors) {
        throw new Error(data.errors[0]?.message || 'Error fetching allocation')
      }

      setAllocation(
        data.data?.zoraTokenAllocation?.totalTokensEarned?.totalTokens || 0
      )
    } catch (err) {
      setError(err.message || 'Failed to fetch allocation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xl mx-auto p-6 bg-gray-50 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-800">
        Zora Allocation Checker
      </h1>

      <div className="text-center text-sm text-red-500 font-medium mb-2">
        DISCLAIMER: This is an unofficial tool and not created by the Zora team.
        This only queries a public API endpoint and no allocations are
        guaranteed.
      </div>

      <div className="w-full">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter wallet address (0x...)"
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={checkAllocation}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? 'Checking...' : 'Check Allocation'}
      </button>

      {error && (
        <div className="w-full p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      {allocation !== null && (
        <div className="w-full flex flex-col items-center p-4 bg-green-100 border border-green-300 text-green-800 rounded">
          <p className="text-sm font-medium">ZORA Tokens Allocation</p>
          <p className="text-2xl font-bold">
            {Number(allocation).toLocaleString(undefined, {
              maximumFractionDigits: 4,
            })}
          </p>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded text-sm">
        <div>
          <h3 className="font-bold mb-2">Important Notes:</h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>These are NOT final allocations</li>
            <li>First snapshot data only</li>
            <li>Doesn't include Zorbs and other activities</li>
            <li>More updates expected in coming days</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ZoraAllocationChecker
