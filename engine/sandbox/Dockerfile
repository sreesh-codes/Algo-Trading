FROM python:3.10-slim

# Create a non-root user
RUN useradd -m -s /bin/bash sandboxuser

# Install required packages (pandas)
RUN pip install --no-cache-dir pandas

# Setup working directory
WORKDIR /app

# Copy the core engine
COPY backtester/ /app/backtester/
COPY participant_runtime/ /app/participant_runtime/
COPY mercantile_sdk/ /app/mercantile_sdk/

# Ensure all files are owned by root but readable by sandboxuser
RUN chown -R root:root /app && chmod -R 755 /app

# Switch to non-root user
USER sandboxuser

# Entrypoint is the runner script. 
# We expect the strategy to be mounted at /competition/strategy.py 
# and the dataset to be mounted at /competition/dataset.csv
ENTRYPOINT ["python", "participant_runtime/runner.py"]
