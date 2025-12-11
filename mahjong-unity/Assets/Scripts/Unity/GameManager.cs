using UnityEngine;
using System.Collections.Generic;
using Mahjong.Core;

namespace Mahjong.Unity
{
    public class GameManager : MonoBehaviour
    {
        [Header("Prefabs")]
        public GameObject TilePrefab; // Assign a Cube with TileVisual component

        [Header("Settings")]
        public float TileWidth = 1.0f;
        public float TileHeight = 1.5f;
        public float TileDepth = 0.8f;

        private GameState _gameState;
        private List<TileVisual> _playerHandVisuals = new List<TileVisual>();
        
        // Positions for the 4 players
        private Vector3[] _handOrigins = new Vector3[] 
        {
            new Vector3(-6, 0, -8), // Player (South/Bottom)
            new Vector3(8, 0, -6),  // Right
            new Vector3(6, 0, 8),   // Top
            new Vector3(-8, 0, 6)   // Left
        };
        
        private Vector3[] _handDirections = new Vector3[]
        {
            Vector3.right,
            Vector3.forward,
            Vector3.left,
            Vector3.back
        };

        [Header("References")]
        public MobileInput InputManager;
        public UIManager UIManager;

        void Start()
        {
            _gameState = new GameState();
            _gameState.InitializeGame();
            
            // Subscribe to Mobile Input
            if (InputManager != null)
            {
                InputManager.OnTileConfirmed += HandleTileDiscard;
                InputManager.OnTileSelected += HandleTileSelected;
            }
            
            RefreshBoard();
        }

        void OnDestroy()
        {
            if (InputManager != null)
            {
                InputManager.OnTileConfirmed -= HandleTileDiscard;
                InputManager.OnTileSelected -= HandleTileSelected;
            }
        }

        private void HandleTileSelected(TileVisual visual)
        {
            // Optional: Pop the tile up visually to show selection
            // visual.transform.localPosition += Vector3.up * 0.2f;
            Debug.Log($"Selected: {visual.TileData}");
        }

        private void HandleTileDiscard(TileVisual visual)
        {
            // Only allow human player (Index 0) to discard on their turn
            if (_gameState.CurrentTurn == 0)
            {
                // Check if the tile is actually in the hand
                if (_gameState.Hands[0].Contains(visual.TileData))
                {
                    _gameState.DiscardTile(0, visual.TileData);
                    
                    // Check Win?
                    // Check AI claims?
                    
                    // For now, just advance turn
                    AdvanceTurn();
                    RefreshBoard();
                }
            }
        }

        private void AdvanceTurn()
        {
            _gameState.CurrentTurn = (_gameState.CurrentTurn + 1) % 4;
            
            // Simple AI loop: Draw -> Discard immediately
            while (_gameState.CurrentTurn != 0)
            {
                Tile drawn = _gameState.DrawTile(_gameState.CurrentTurn);
                // AI Logic: Just discard the drawn tile for now
                _gameState.DiscardTile(_gameState.CurrentTurn, drawn);
                
                _gameState.CurrentTurn = (_gameState.CurrentTurn + 1) % 4;
            }
            
            // Player's turn again: Draw a tile
            if (_gameState.CurrentTurn == 0)
            {
                _gameState.DrawTile(0);
            }
        }

        private void RefreshBoard()
        {
            // Clear existing visuals
            foreach (var v in _playerHandVisuals) Destroy(v.gameObject);
            _playerHandVisuals.Clear();

            // Re-instantiate Player 0's hand
            List<Tile> playerHand = _gameState.Hands[0];
            Vector3 startPos = _handOrigins[0];
            
            for (int i = 0; i < playerHand.Count; i++)
            {
                GameObject go = Instantiate(TilePrefab, startPos + (Vector3.right * i * TileWidth), Quaternion.identity);
                TileVisual tv = go.GetComponent<TileVisual>();
                if (tv != null)
                {
                    tv.Setup(playerHand[i]);
                    _playerHandVisuals.Add(tv);
                }
            }
            
            // TODO: Visualize AI hands (face down) and Discards
        }
    }
}
