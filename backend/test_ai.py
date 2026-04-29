import asyncio
from db.session import SessionLocal
from services.ai_service import run_ai_chat

def main():
    db = SessionLocal()
    try:
        response, tools = run_ai_chat(db, "which products are low in stock?")
        print("RESPONSE:", response)
        print("TOOLS:", tools)
    except Exception as e:
        print("ERROR:", str(e))
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
