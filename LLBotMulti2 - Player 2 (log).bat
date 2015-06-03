@echo off
set /p id=ADVERSARIO: 
echo -- NOVA PARTIDA -- >> log.txt
time /t >> log.txt
echo %id% >> log.txt
echo PECAS PRETAS
@echo on
node LLBotMultiOrchestrator2.js -p 50200 >> log.txt
pause