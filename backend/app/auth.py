import os
import firebase_admin
from firebase_admin import auth, credentials, firestore
from fastapi import HTTPException, Depends, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

load_dotenv()

def _initialize_firebase():
    if firebase_admin._apps:
        return

    cred_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
    if not cred_path:
        raise RuntimeError(
            "FIREBASE_SERVICE_ACCOUNT_PATH não foi definido. "
            "Configure essa variável apontando para o JSON da service account do Firebase."
        )

    if not os.path.exists(cred_path):
        raise RuntimeError(
            f"Arquivo da service account do Firebase não encontrado: {cred_path}"
        )

    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)


def get_firestore_client():
    _initialize_firebase()
    return firestore.client()


class FirestoreClientProxy:
    def __getattr__(self, name):
        return getattr(get_firestore_client(), name)


db = FirestoreClientProxy()
security = HTTPBearer()

async def get_current_user(res: HTTPAuthorizationCredentials = Security(security)):
    try:
        _initialize_firebase()
        decoded_token = auth.verify_id_token(res.credentials)
        return decoded_token
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido")

async def get_user_data(user=Depends(get_current_user)):
    user_ref = db.collection('users').document(user['uid']).get()
    if not user_ref.exists:
        return {"uid": user['uid'], "isAdmin": False, "isBanned": False}
    data = user_ref.to_dict()
    if data.get('isBanned'):
        raise HTTPException(status_code=403, detail="Banned")
    data['uid'] = user['uid']
    return data

def require_admin(user_data=Depends(get_user_data)):
    if not user_data.get('isAdmin'):
        raise HTTPException(status_code=403, detail="Admin required")
    return user_data
