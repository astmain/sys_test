from huggingface_hub import snapshot_download  # pip install huggingface_hub

if __name__ == '__main__':
    my_repo_id = "bert-base-uncased"
    my_local_dir = "./bert-base-uncased"
    snapshot_download(repo_id=my_repo_id, local_dir=my_local_dir)
    print("下载完成")
