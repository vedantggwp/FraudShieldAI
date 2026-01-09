"""
FraudShield In-Memory Storage

Thread-safe storage for transactions using a dictionary.
"""

from datetime import datetime
from threading import Lock
from typing import Optional
import uuid


class TransactionStore:
    """Thread-safe in-memory storage for transactions."""

    def __init__(self):
        self._transactions: dict[str, dict] = {}
        self._lock = Lock()

    def add(self, transaction_data: dict) -> str:
        """
        Add a new transaction and return its ID.

        Args:
            transaction_data: Transaction data dict

        Returns:
            str: Generated transaction ID
        """
        transaction_id = str(uuid.uuid4())
        with self._lock:
            self._transactions[transaction_id] = {
                **transaction_data,
                "id": transaction_id,
                "created_at": datetime.utcnow(),
            }
        return transaction_id

    def get(self, transaction_id: str) -> Optional[dict]:
        """
        Retrieve a single transaction by ID.

        Args:
            transaction_id: The transaction UUID

        Returns:
            dict or None: Transaction data if found
        """
        return self._transactions.get(transaction_id)

    def get_all(self, skip: int = 0, limit: int = 100) -> tuple[list[dict], int]:
        """
        Retrieve paginated transactions sorted by created_at (newest first).

        Args:
            skip: Number of items to skip
            limit: Maximum items to return

        Returns:
            tuple: (list of transactions, total count)
        """
        with self._lock:
            all_items = list(self._transactions.values())
            total = len(all_items)
            all_items.sort(key=lambda x: x["created_at"], reverse=True)
            return all_items[skip : skip + limit], total

    def update(self, transaction_id: str, updates: dict) -> bool:
        """
        Update a transaction with new data.

        Args:
            transaction_id: The transaction UUID
            updates: Dict of fields to update

        Returns:
            bool: True if update succeeded
        """
        with self._lock:
            if transaction_id in self._transactions:
                self._transactions[transaction_id].update(updates)
                return True
            return False

    def load_seed_data(self, seed_data: list[dict]) -> int:
        """
        Load seed data into the store.

        Args:
            seed_data: List of transaction dicts

        Returns:
            int: Number of transactions loaded
        """
        count = 0
        for item in seed_data:
            # Use provided ID if available, otherwise generate one
            if "id" in item:
                transaction_id = item["id"]
                with self._lock:
                    self._transactions[transaction_id] = {
                        **item,
                        "created_at": item.get("created_at", datetime.utcnow()),
                    }
            else:
                self.add(item)
            count += 1
        return count

    def clear(self) -> None:
        """Clear all transactions (useful for testing)."""
        with self._lock:
            self._transactions.clear()


# Global singleton instance
transaction_store = TransactionStore()
